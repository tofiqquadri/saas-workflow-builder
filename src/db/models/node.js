import mongoose from 'mongoose';

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const NodeSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true
        },
        label: {
            type: String,
            required: true,
            trim: true
        },
        icon: {
            type: String,
            required: true,
            trim: true
        },
        hasSource: {
            type: Boolean,
            required: true
        },
        hasTarget: {
            type: Boolean,
            required: true
        },
        config: {
            type: Object,
            required: false
        }
    },
    {
        timestamps: true
    }
);

NodeSchema.index({ name: 'label' });

module.exports = mongoose.models.Node || mongoose.model('Node', NodeSchema);
