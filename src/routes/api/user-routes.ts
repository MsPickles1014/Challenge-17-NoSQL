import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    addFriend,
    removeFriend
} from '../../controllers/user-controller.js';

const userRoutes = Router();

// /api/users
userRoutes.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId
userRoutes.route('/:userId').get(getUserById).delete(deleteUser);

// /api/users/:userId/friends/:friendId
userRoutes.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend); // 

export default userRoutes;
