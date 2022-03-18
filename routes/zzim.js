const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const { createZzim } = require('../controller/zzim')

router.post('/detail/:postId/zzim', authMiddleware, createZzim);

module.exports = router;