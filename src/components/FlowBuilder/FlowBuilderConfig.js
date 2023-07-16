import uuid4 from 'uuid4';
import { MarkerType } from 'reactflow';
import CustomNode from './Nodes/CustomNode/CustomNode';

export const DEFAULT_EDGE_CONFIG = {
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#FF0072'
    },
    type: 'step'
};

export const connectionLineStyle = { stroke: '#3C639B' };

export const getId = () => `dndnode_${uuid4()}`;

export const NODE_TYPES = {
    customNode: CustomNode
};
