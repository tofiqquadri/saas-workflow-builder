'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    MarkerType,
    Background,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './SideBar/SideBar';
import NodeConfigureationPanel from './NodeConfigureationPanel/NodeConfigureationPanel';
import CustomNode from './Nodes/CustomNode/CustomNode';
import uuid4 from 'uuid4';
import _ from 'lodash';
import { NODE_SCHEMA_LIST } from './mock-api';
import styles from './FlowBuilder.module.css';

const UI_NODES = _.cloneDeep(NODE_SCHEMA_LIST);

const initialNodes = [
    // {
    //     id: '1',
    //     type: 'input',
    //     data: { label: 'input node' },
    //     position: { x: 250, y: 5 }
    // }
];

const DEFAULT_EDGE_CONFIG = {
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#FF0072'
    },
    type: 'step'
};
const NODE_TYPES = {
    customNode: CustomNode
};
const connectionLineStyle = { stroke: '#3C639B' };

const getId = () => `dndnode_${uuid4()}`;

const FlowBuilder = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);

    const onUpdateNodeDataHandler = (formData, nodeId) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id !== nodeId) {
                    return node;
                }

                console.log('Edit', node);
                return {
                    ...node,
                    data: {
                        ...node.data,
                        config: {
                            ...node.data.config,
                            form: {
                                ...node.data.config.form,
                                data: { ...formData }
                            }
                        }
                    }
                };
            })
        );
    };

    useEffect(() => {
        if (selectedNode) {
            const currentSelectedNode = nodes.find(
                (node) => node.id === selectedNode.id
            );
            setSelectedNode(currentSelectedNode);
        }
    }, [nodes]);

    const onConnect = useCallback(
        (params) =>
            setEdges((eds) =>
                addEdge(
                    {
                        ...params,
                        ...DEFAULT_EDGE_CONFIG
                    },
                    eds
                )
            ),
        []
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds =
                reactFlowWrapper.current.getBoundingClientRect();
            const uiNode = JSON.parse(
                event.dataTransfer.getData('application/reactflow')
            );
            const { type, nodeIdentifier } = uiNode;

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: {
                    label: `${type} node`,
                    onUpdateNodeData: onUpdateNodeDataHandler,
                    ...uiNode
                },
                style: {
                    background: '#fff',
                    border: '1px solid #E0E0E0',
                    fontSize: 8
                }
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    const onNodeClick = (event) => {
        const { id } = event?.target?.dataset;
        // console.log(id, event);
        if (id) {
            const selectedNode = nodes.find((node) => node.id === id);
            setSelectedNode(selectedNode);
        }
    };

    const onCloseNodeConfigureationPanelHandler = () => {
        setSelectedNode(null);
    };

    const onSaveWorkFlowHandler = () => {
        let formattedData = { nodes: nodes, edges: edges };

        console.log(formattedData);
        console.log(JSON.stringify(formattedData));
        localStorage.setItem('workflow', JSON.stringify(formattedData));
    };

    const onLoadWorkFlowFromDBHandler = () => {
        const workflow = localStorage.getItem('workflow');
        if (workflow) {
            const { nodes, edges } = JSON.parse(workflow);
            reInitializeNodes(nodes);
            setNodes(nodes);
            setEdges(edges);
        }
    };

    const reInitializeNodes = (nodes) => {
        for (let index = 0; index < nodes.length; index++) {
            nodes[index].data['onUpdateNodeData'] = onUpdateNodeDataHandler;
        }
    };

    return (
        <div className={styles.FlowBuilderContainer}>
            <ReactFlowProvider>
                <Sidebar
                    nodeTypes={UI_NODES}
                    onExport={onSaveWorkFlowHandler}
                    onLoad={onLoadWorkFlowFromDBHandler}
                />
                <div
                    className={styles.FlowBuilderWrapper}
                    ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={NODE_TYPES}
                        onNodeClick={onNodeClick}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        connectionLineType={'step'}
                        connectionLineStyle={connectionLineStyle}
                        fitView
                        elementsSelectable>
                        <Controls />
                        <Background variant="dots" gap={4} size={0.5} />
                    </ReactFlow>
                </div>
                <NodeConfigureationPanel
                    node={selectedNode}
                    onClose={onCloseNodeConfigureationPanelHandler}
                />
            </ReactFlowProvider>
        </div>
    );
};

export default FlowBuilder;
