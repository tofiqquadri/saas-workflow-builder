'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import toast from 'react-hot-toast';
import { addEdge } from 'reactflow';
import { Controls } from 'reactflow';
import { Background } from 'reactflow';
import Sidebar from './SideBar/SideBar';
import { useNodesState } from 'reactflow';
import { useEdgesState } from 'reactflow';
import { getConnectedEdges } from 'reactflow';
import { getOutgoers } from 'reactflow';
import { getId } from './FlowBuilderConfig';
import { ReactFlowProvider } from 'reactflow';
import styles from './FlowBuilder.module.css';
import { NODE_TYPES } from './FlowBuilderConfig';
import { UPDATE_WORKFLOW } from '@/db/mutations';
import { GET_NODES, GET_WORKFLOW } from '@/db/queries';
import { DEFAULT_EDGE_CONFIG } from './FlowBuilderConfig';
import { connectionLineStyle } from './FlowBuilderConfig';
import DataLoader from '../UI/Loader/DataLoader/DataLoader';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import NodeConfigureationPanel from './NodeConfigureationPanel/NodeConfigureationPanel';

const initialNodes = [];

const FlowBuilder = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const [sidebarUINodes, setSidebarUINodes] = useState([]);
    const [hidden, setHidden] = useState(true);

    let outgoers = [];
    let connectedEdges = [];
    let stack = [];

    const [
        updateWorkflow,
        {
            loading: loadingUpdateWorkflow,
            error: errorUpdateWorkflow,
            data: dataUpdateWorkflow
        }
    ] = useMutation(UPDATE_WORKFLOW);

    const [
        getWorkflow,
        {
            loading: loadingGetWorkflow,
            error: errorGetWorkflow,
            data: dataGetWorkflow
        }
    ] = useLazyQuery(GET_WORKFLOW);

    const {
        data: dataNodes,
        loading: loadingNodes,
        error: errorNodes
    } = useQuery(GET_NODES);

    const onUpdateNodeDataHandler = (formData, nodeId) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id !== nodeId) {
                    return node;
                }

                toast.success('Success updating node data');
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

    useEffect(() => {
        const { getWorkflow } = dataGetWorkflow || { getWorkflow: null };
        if (getWorkflow) {
            const { nodes, edges } = getWorkflow;

            const nodesJSON = nodes ? JSON.parse(nodes) : [];
            const edgesJSON = edges ? JSON.parse(edges) : [];

            reInitializeNodes(nodesJSON);
            setNodes(nodesJSON);
            setEdges(edgesJSON);
        }
    }, [dataGetWorkflow]);

    useEffect(() => {
        const { getNodes } = dataNodes || { getNodes: null };

        if (getNodes) {
            let newSidebarUINodes = getNodes.map((node) => {
                return {
                    ...node,
                    config: JSON.parse(node.config)
                };
            });
            setSidebarUINodes(newSidebarUINodes);
        }
    }, [dataNodes]);

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

    const hide = (hidden, childEdgeID, childNodeID) => (nodeOrEdge) => {
        if (
            childEdgeID.includes(nodeOrEdge.id) ||
            childNodeID.includes(nodeOrEdge.id)
        )
            nodeOrEdge.hidden = hidden;
        return nodeOrEdge;
    };

    const checkTarget = (edge, id) => {
        let edges = edge.filter((ed) => {
            return ed.target !== id;
        });
        return edges;
    };

    const onNodeClick = (event) => {
        const { id } = event?.target?.dataset;
        let node = nodes.find((node) => node.id === id);

        if (id) {
            const selectedNode = nodes.find((node) => node.id === id);
            setSelectedNode(selectedNode);
        } else {
            return;
        }

        if (!node || !node.id) {
            return;
        }

        // Expand and Collapse Nodes
        let currentNodeID = node.id;
        stack.push(node);
        while (stack.length > 0) {
            let lastNOde = stack.pop();
            let childnode = getOutgoers(lastNOde, nodes, edges);
            let childedge = checkTarget(
                getConnectedEdges([lastNOde], edges),
                currentNodeID
            );
            childnode.map((goer, key) => {
                stack.push(goer);
                outgoers.push(goer);
            });
            childedge.map((edge, key) => {
                connectedEdges.push(edge);
            });
        }

        let childNodeID = outgoers.map((node) => {
            return node.id;
        });
        let childEdgeID = connectedEdges.map((edge) => {
            return edge.id;
        });

        setNodes((nodes) => nodes.map(hide(hidden, childEdgeID, childNodeID)));
        setEdges((edges) => edges.map(hide(hidden, childEdgeID, childNodeID)));
        setHidden(!hidden);
    };

    const onCloseNodeConfigureationPanelHandler = () => {
        setSelectedNode(null);
    };

    const onSaveWorkFlowHandler = () => {
        let nodesString = nodes ? JSON.stringify(nodes) : null;
        let edgesString = edges ? JSON.stringify(edges) : null;

        updateWorkflow({
            variables: {
                updateWorkflowId: '64b13a15b70c350faf7f7a79',
                input: { nodes: nodesString, edges: edgesString }
            }
        });
    };

    const onLoadWorkFlowFromDBHandler = () => {
        getWorkflow({
            variables: { getWorkflowId: '64b13a15b70c350faf7f7a79' }
        });
    };

    const reInitializeNodes = (nodes) => {
        for (let index = 0; index < nodes.length; index++) {
            nodes[index].data['onUpdateNodeData'] = onUpdateNodeDataHandler;
        }
    };

    const containerNotificationsUI = (
        <>
            {loadingGetWorkflow && (
                <LoaderUI message={'Downloading workflow...'} />
            )}
            {errorGetWorkflow && (
                <span className="text-red-500">Error downloading workflow</span>
            )}
            {loadingUpdateWorkflow && (
                <LoaderUI message={'Uploading workflow...'} />
            )}
            {errorUpdateWorkflow && (
                <span className="text-red-500">Error uploading workflow</span>
            )}
        </>
    );

    return (
        <div className={styles.FlowBuilderContainer}>
            <ReactFlowProvider>
                <Sidebar
                    loading={loadingNodes}
                    error={errorNodes}
                    nodeTypes={sidebarUINodes}
                    onExport={onSaveWorkFlowHandler}
                    onLoad={onLoadWorkFlowFromDBHandler}
                />
                <div
                    className={styles.FlowBuilderWrapper}
                    ref={reactFlowWrapper}>
                    {containerNotificationsUI}
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

const LoaderUI = ({ message }) => (
    <div className="flex flex-col justify-center items-center w-full">
        <DataLoader />
        <span className="text-purple-900">{message}</span>
    </div>
);

export default FlowBuilder;
