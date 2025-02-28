import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Thought } from '../models/index.js';

// Load environment variables
dotenv.config();

// MongoDB Connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/socialmedia'

const seedDatabase = async () => {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as mongoose.ConnectOptions);

        console.log('🔥 Clearing existing data...');
        await User.deleteMany({});
        await Thought.deleteMany({});

        console.log('✨ Seeding Users...');
        const users = await User.insertMany([
            {
                username: 'john_doe',
                email: 'john@example.com',
                thoughts: [],
                friends: []
            },
            {
                username: 'jane_smith',
                email: 'jane@example.com',
                thoughts: [],
                friends: []
            },
            {
                username: 'alice_wonderland',
                email: 'alice@example.com',
                thoughts: [],
                friends: []
            }
        ]);

        console.log('💭 Seeding Thoughts...');
        const thoughts = await Thought.insertMany([
            {
                thoughtText: 'This is my first thought!',
                username: users[0].username,
                reactions: []
            },
            {
                thoughtText: 'Hello world, this is Jane!',
                username: users[1].username,
                reactions: []
            },
            {
                thoughtText: 'Alice loves exploring!',
                username: users[2].username,
                reactions: []
            }
        ]);

        // Associate thoughts with users
        await Promise.all(users.map(async (user: any, index: number) => {
            await User.findByIdAndUpdate(
                user._id,
                { $push: { thoughts: thoughts[index]._id } },
                { new: true }
            );
        }));

        // Add friends (bi-directional)
        await User.findByIdAndUpdate(users[0]._id, { $push: { friends: users[1]._id } });
        await User.findByIdAndUpdate(users[1]._id, { $push: { friends: users[0]._id } });

        console.log('✅ Seeding complete!');

        // Disconnect from MongoDB
        await mongoose.connection.close();
        console.log('🚀 Database connection closed.');
    } catch (error: any) {
        console.error('❌ Seeding failed:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
