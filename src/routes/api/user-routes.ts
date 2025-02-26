import { Router } from 'express';
import {getAllUsers, getUserById, createUser, deleteUser, addFriend, removeFriend,} from '../../controllers/user-controller';
const router = Router();



// /api/users
router.route('/').get(getAllUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getUserById).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').delete(removeFriend);

export {router as userRoutes} ;