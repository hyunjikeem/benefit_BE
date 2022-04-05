const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middleware/auth-middleware');
const userController = require('../controller/user');

const { kakaoCallback } = require('../controller/user');

// router.get('/auth', authMiddleware);
router.get('/kakao', passport.authenticate('kakao')/*, kakaoCallback*/);
router.get('/kakao/callback', /*passport.authenticate('kakao'),*/userController.kakaoCallback);


module.exports = router;