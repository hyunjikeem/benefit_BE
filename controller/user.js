const passport = require('passport');
// const sequelize = require('sequelize');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');


const kakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', { failureRedirect: '/' }, async (err, user, info) => {
        if (err) return next(err);
        const { userId, nickname } = user;
        const token = jwt.sign({ userId: userId }, process.env.TOKENKEY);
        console.log(token);
        result = {
            token: token,
            nickname: nickname,
            userId,
        };
        const result2 = await sequelize.query('SELECT zf.folder_name, zf.folderId, zf.folder_status, z.postId FROM ybrn_db.Zzim_folders as zf LEFT JOIN ybrn_db.Zzims as z ON zf.folderId = z.folderId', { type: QueryTypes.SELECT });
        console.log(result);
        console.log(result2);
        res.send({ user: result, result2 });
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

