const typeDefs = `#graphql
    # Node

    type Node {
        nodeIdentifier: ID,
        type: String!
        label: String!
        icon: String
        hasSource: Boolean
        hasTarget: Boolean
        config: String
    }

    input NodeInput {
        type: String!
        label: String!
        icon: String
        hasSource: Boolean
        hasTarget: Boolean
        config: String
    }

    input NodeUpdateInput {
        type: String
        label: String
        icon: String
        hasSource: Boolean
        hasTarget: Boolean
        config: String
    }

    #Workflow

    type Workflow {
        nodes: String
        edges: String
    }    

    input WorkflowInput {
        nodes: String
        edges: String
    }

    type Query {
        getNodes: [Node]
        getWorkflow(id: ID!): Workflow
    }

    type Mutation {
        #Node
        newNode(input: NodeInput): Node
        updateNode(id: ID!, input: NodeUpdateInput): Node
        deleteNode(id: ID!): String

        #Workflow
        newWorkflow(input: WorkflowInput): Workflow
        updateWorkflow(id: ID!, input: WorkflowInput): Workflow
    }
`;

export default typeDefs;
