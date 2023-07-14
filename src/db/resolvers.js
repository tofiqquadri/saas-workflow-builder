const Node = require('./models/node');
const Workflow = require('./models/workflow');

const resolvers = {
    Query: {
        getNodes: async () => {
            try {
                const nodes = await Node.find({});

                const uiNodes = nodes.map((node) => ({
                    ...node._doc,
                    nodeIdentifier: node._doc._id
                }));

                return uiNodes;
            } catch (err) {
                console.log(err);
            }
        },
        getWorkflow: async (_, { id }) => {
            const workflow = await Workflow.findById(id);

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            return { ...workflow._doc };
        }
    },

    Mutation: {
        // Node
        newNode: async (_, { input }) => {
            try {
                const node = new Node(input);

                const result = await node.save();

                return { ...result._doc, nodeIdentifier: result._doc._id };
            } catch (err) {
                console.log(err);
            }
        },
        updateNode: async (_, { id, input }) => {
            let node = await Node.findById(id);

            if (!node) {
                throw new Error('Node not found');
            }

            node = await Node.findOneAndUpdate({ _id: id }, input, {
                new: true
            });

            return { ...node._doc, nodeIdentifier: id };
        },
        deleteNode: async (_, { id }) => {
            const node = await Node.findById(id);

            if (!node) {
                throw new Error('Node not found');
            }

            await Node.findOneAndDelete({ _id: id });

            return { success: true, error: false, message: 'Node Deleted' };
        },

        // Workflow
        newWorkflow: async (_, { input }) => {
            try {
                const workflow = new Workflow(input);

                const result = await workflow.save();

                return { ...result._doc };
            } catch (err) {
                console.log(err);
            }
        },
        updateWorkflow: async (_, { id, input }) => {
            let workflow = await Workflow.findById(id);

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            workflow = await Workflow.findOneAndUpdate({ _id: id }, input, {
                new: true
            });

            return { ...workflow._doc };
        }
    }
};

module.exports = resolvers;
