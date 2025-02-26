import { Schema, model, Document, Types } from 'mongoose';

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
        }
    }
);

// Define Thought Interface
interface IThought extends Document {
    thoughtText: string;
    createdAt: Date;
    username: string;
    reactions: {
        reactionId: Types.ObjectId;
        reactionBody: string;
        username: string;
        createdAt: Date;
    }[];
    
}

// Create Thought Schema
const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: { virtuals: true, getters: true },
        timestamps: true, 
        id:false// Mongoose automatically adds createdAt & updatedAt
    }
);

// **Virtual Property: reactionCount**
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Create Thought Model
const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
