const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    JSON.stringify(authorization);
    const [tokenType, tokenValue] = (authorization||'').split(' ');

    if (tokenType !== 'Bearer') {
        next()
        return
    }

    try {
        const { userId } = jwt.verify(tokenValue, process.env.TOKENKEY);
        User.findByPk (userId).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용해주세요',
        });
        return;
    };
};