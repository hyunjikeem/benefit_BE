const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middleware/auth-middleware');
const userController = require('../controller/user');


router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', userController.kakaoCallback);


module.exports = router;