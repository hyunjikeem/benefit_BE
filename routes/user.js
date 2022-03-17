const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middleware/auth-middleware');
const userController = require('../controller/user');

const { kakaoCallback, googleCallback, naverCallback, auth } = require('../controller/user');

// router.get('/auth', authMiddleware);
router.get('/kakao', passport.authenticate('kakao')/*, kakaoCallback*/);
router.get('/kakao/callback', /*passport.authenticate('kakao'),*/userController.kakaoCallback);
router.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }));
router.get('/naver/callback', userController.naverCallback);
// router.get('/google/callback', passport.authenticate('google', { scope: ['profile', 'email'] }), googleCallback);
// router.get('/google/callback', passport.authenticate('google'), userController.googleCallback);
router.get('/google/callback', passport.authenticate('google', { scope: ['profile', 'email'] }), googleCallback);
// router.get('/google/callback', passport.authenticate('google'), userController.googleCallback);

router.get('/users/me', authMiddleware, auth);


module.exports = router;
