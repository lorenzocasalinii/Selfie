import express from 'express';
import { getMessages, sendMessage, deleteMessage, completeMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/:userID', getMessages);
router.post('/', sendMessage);
router.delete('/:id', deleteMessage);
router.patch('/:id', completeMessage);

export default router;
