import { gql } from '@apollo/client';

export const UPDATE_WORKFLOW = gql`
    mutation UpdateWorkflow($updateWorkflowId: ID!, $input: WorkflowInput) {
        updateWorkflow(id: $updateWorkflowId, input: $input) {
            edges
            nodes
        }
    }
`;
