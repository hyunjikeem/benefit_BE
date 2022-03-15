const passport = require("../passport");

const kakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', { failureRedirect: '/' }, (err, user, info))
}

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
    },
);

router.get('/naver/callback', passport.authenticate('naver', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
    },
);

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
    },
);