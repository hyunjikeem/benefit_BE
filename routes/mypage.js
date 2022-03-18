const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

const { getZzimList, getCommentList } = require('../controller/mypage');

router.get('/user/pick', authMiddleware, getZzimList);

router.get('/user/review', authMiddleware, getCommentList);

module.exports = router;