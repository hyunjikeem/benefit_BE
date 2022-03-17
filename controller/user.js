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

const Login_maintain = async (req, res) => {
    const { user } = res.locals;
    console.log(user);
    res.send({
        user,
    });
};

module.exports = {
    kakaoCallback,
    googleCallback,
    naverCallback,
    Login_maintain,
    // getUser,
    // getUserInfo,
};

