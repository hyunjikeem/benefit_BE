const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

const { makeComment, updateComment, deleteComment } = require('../controller/comment');

router.post('/comment', authMiddleware, makeComment);

router.put('/comment/update', authMiddleware, updateComment);

router.delete('/comment/delete/:commentId', authMiddleware, deleteComment);

module.exports = router;