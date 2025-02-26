import { Schema, model, Document, Types } from 'mongoose';

// Define User Interface
interface IUser extends Document {
    username: string;
    email: string;
    thoughts: Types.ObjectId[]; // Array of Thought IDs
    friends: Types.ObjectId[]; // Array of User IDs (self-reference)
}

// Create User Schema
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought' // Reference Thought model
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User' // Self-referencing User model
            }
        ]
    },
    {
        toJSON: {
            virtuals: true // Enable virtuals in JSON output
        },
        timestamps: true
    }
);

// **Virtual Property: friendCount**
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// Create User Model
const User = model<IUser>('User', userSchema);

export default User;
