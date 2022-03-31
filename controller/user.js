const passport = require('passport');
// const sequelize = require('sequelize');
const { Zzim_folder } = require('../models');
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
        
        const find_folder = await Zzim_folder.findOne({
            where: { userId }
        });

        if (!find_folder) {

            await Zzim_folder.create({ 
                userId,
                folder_name: '기본 폴더',
                folder_status : false,
                nickname
             })
        }

        const result2 = await sequelize.query(`SELECT f.folder_name, f.folderId, f.folder_status, group_concat(z.postId) as postId_list FROM Zzim_folders as f LEFT JOIN Zzims as z on z.folderId = f.folderId where f.userId = ${userId} group by f.folderId;`, { type: QueryTypes.SELECT });
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

