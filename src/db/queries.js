import { gql } from '@apollo/client';

export const GET_NODES = gql`
    query GetNodes {
        getNodes {
            config
            hasSource
            icon
            hasTarget
            label
            nodeIdentifier
            type
        }
    }
`;

export const GET_WORKFLOW = gql`
    query GetWorkflow($getWorkflowId: ID!) {
        getWorkflow(id: $getWorkflowId) {
            edges
            nodes
        }
    }
`;
