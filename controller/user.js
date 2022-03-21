const passport = require('passport');
// const Sequelize = require('sequelize');
// const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

const kakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', { failureRedirect: '/' }, (err, user, info) => {
        if (err) return next(err);
        const { userId, nickname } = user;
        const token = jwt.sign({ userId: userId }, process.env.TOKENKEY);
        console.log(token);
        result = {
            token: token,
            nickname: nickname,
            userId,
        };
        console.log(result);
        res.send({ user: result });
    })(req, res, next);
};

const  googleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
        if (err) return next(err);
        const { userId, nickname } = user;
        const token = jwt.sign({ userId: userId }, process.env.TOKENKEY);
        result = {
            token: token,
            nickname: nickname,
            userId,
        };
        res.send({ user: result });
    })(req, res, next);
};

const naverCallback = (req, res, next) => {
    passport.authenticate('naver', { failureRedirect: '/' }, (err, user, info) => {
        if (err) return next(err);
        const { userId, nickname } = user;
        const token = jwt.sign({ userId: userId }, process.env.TOKENKEY);
        result = {
            token: token,
            nickname: nickname,
            userId,
        };
    })(req, res, next);
};


module.exports = {
    kakaoCallback,
    googleCallback,
    naverCallback,
};

