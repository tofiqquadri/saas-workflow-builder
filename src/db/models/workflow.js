import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const WorkflowSchema = new Schema(
    {
        nodes: {
            type: String
        },
        edges: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Workflow || mongoose.model('Workflow', WorkflowSchema);
