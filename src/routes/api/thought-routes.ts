import { Router } from 'express';
import {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,
  } from '../../controllers/thought-controller.js';

const thoughtRouter = Router();
// /api/thoughts
thoughtRouter.route('/').get(getAllThoughts).post(createThought);

// /api/thoughts/:thoughtId
thoughtRouter
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
thoughtRouter.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
thoughtRouter.route('/:thoughtId/reactions/:reactionid').delete(removeReaction)

export default thoughtRouter;