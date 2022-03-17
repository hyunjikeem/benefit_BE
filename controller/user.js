const passport = require('passport');
// const Sequelize = require('sequelize');
// const { User } = require('../models/user');
const jwt = require('jsonwebtoken');

const kakaoCallback = (req, res, next) => {
    /*req.app.get('*/passport/*')*/.authenticate('kakao', { failureRedirect: '/' }, (err, user, info) => {
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
    /*req.app.get('*/passport/*')*/.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
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
    /*req.app.get('*/passport/*')*/.authenticate('naver', { failureRedirect: '/' }, (err, user, info) => {
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

// const getUser = async (req, res, next) => {
//     try {
//         const { userId: userId } = res.locals.user;
//         const result = await userService.getUserByUserId({ userId });
//         res.status(200).send({ user: result });
//     } catch (error) {
//         next(error);
//     }
// };

// const getUserInfo = async (req, res, next) => {
//     try {
//         const { userId } = req.params;
//         const result = await userService.getUserByUserId({ userId });
//         res.status(200).send({ result });
//     } catch (error) {
//         next (error);
//     }
// };

const auth = async (req, res) => {
    try {
        const user = res.locals.user;
        res.json({
            ok: true,
            message: '로그인 정보 불러오기 성공',
            userId: user.userId,
            nickname: user.nickname,
        });
    } catch (error) {
        res.json({
            ok: false,
            message: '로그인 정보 불러오기 실패',
        });
        console.error(`로그인 정보 불러오기에서 ${error}가 발생했습니다`);
    }
};

module.exports = {
    kakaoCallback,
    googleCallback,
    naverCallback,
    auth,
    // getUser,
    // getUserInfo,
};

