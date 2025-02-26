// import { ObjectId } from 'mongodb';
import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';




// get all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }


// get single user by id

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params; // Extract userId from request parameters
  try {
      const user = await User.findById(userId);
      if (user) {
          res.json({ user });
      } else {
          res.status(404).json({
              message: 'User not found'
          });
      }
  } catch (error: any) {
      res.status(500).json({
          message: error.message
      });
  }
};



// create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }


// update a user

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params; // Extract userId from request parameters
  try {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });

      if (updatedUser) {
          res.json({ message: 'User updated successfully', user: updatedUser });
      } else {
          res.status(404).json({
              message: 'User not found'
          });
      }
  } catch (error: any) {
      res.status(500).json({
          message: error.message
      });
  }
};


// delete user (BONUS: and delete associated thoughts)
export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thought deleted!' })
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }

// add friend to friend list

// export const addFriend = async (req: Request, res: Response) => {
//   const { userId, friendId } = req.params; // Extract user and friend IDs from request parameters

//   try {
//       // Find the user and update their friends list
//       const user = await User.findByIdAndUpdate(
//           userId,
//           { $addToSet: { friends: friendId } }, // Add friendId to friends array (avoids duplicates)
//           { new: true, runValidators: true } // Return updated user and enforce validation
//       );

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       res.json({ message: 'Friend added successfully', user });
//   } catch (error: any) {
//       res.status(500).json({ message: error.message });
//   }
// };





// // remove friend from friend list
// export const removeFriend = async (req: Request, res: Response) => {
//   const { userId, friendId } = req.params; // Extract user and friend IDs from request parameters

//   try {
//       // Find the user and update their friends list by pulling out the friendId
//       const user = await User.findByIdAndUpdate(
//           userId,
//           { $pull: { friends: friendId } }, // Remove friendId from friends array
//           { new: true } // Return updated user after removal
//       );

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       res.json({ message: 'Friend removed successfully', user });
//   } catch (error: any) {
//       res.status(500).json({ message: error.message });
//   }
// };
