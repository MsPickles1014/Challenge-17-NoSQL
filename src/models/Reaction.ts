
import { Schema, Types } from 'mongoose';
// Define Reaction Schema
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280, // Ensures max length is 280 characters
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp: Date) => timestamp.toLocaleString() // Formats timestamp
        }
    },
    {
        toJSON: {
            getters: true,
        }, 
        _id: false
    }
);

export default reactionSchema;