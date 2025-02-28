import { Request, Response } from 'express';
import { Thought, User } from '../models/index.js';

// get all thoughts
export const getAllThoughts = async(_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch(error: any){
        res.status(500).json({
            message: error.message
        });
    }
}

// get single thought by id

export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
      const user = await Thought.findById(thoughtId);
      if(user) {
        res.json(user);
      } else {
        res.status(404).json({
          message: 'Thought not found'
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

// create a thought
export const createThought = async (req: Request, res: Response) => {
    const { thoughtText, username } = req.body;

    try {
        const newThought = await Thought.create({ thoughtText, username });

        // Push the new thought into the user's `thoughts` array
        await User.findOneAndUpdate(
            { username: username },
            { $push: { thoughts: newThought._id } },
            { new: true }
        );

        res.status(201).json(newThought);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};




// update thought
export const updateThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought)
    } catch (error: any) {
      res.status(400).json({
        message: error.message
      });
    }
  };
// delete thought

export const deleteThought = async (req: Request, res: Response) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId});
      
      if(!thought) {
        res.status(404).json({
          message: 'No thought with that ID'
        });
      } else {
        await User.deleteMany({ _id: req.params.thoughtId});
        res.json({ message: 'Thoughts and Users deleted!' });
      }
      
    } catch (error: any) {
      res.status(500).json({
        message: error.message
      });
    }
  };

// add a reaction to a thought

export const addReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $push: { reactions: req.body } }, 
            { new: true, runValidators: true }
        );

        if (thought) {
            return res.json({ message: "Reaction added successfully", thought });
        } else {
            return res.status(404).json({ message: "Thought not found" });
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// remove reaction from a thought
export const removeReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } }, 
            { new: true }
        );

        if (thought) {
            return res.json({ message: "Reaction removed successfully", thought });
        } else {
            return res.status(404).json({ message: "Thought not found" });
        }
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};
