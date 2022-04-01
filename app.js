require('dotenv').config(); // 환경변수
const express = require('express');
const { sequelize } = require('./models');
const app = express();
// const passport = require('passport');
const passportConfig = require('./passport');
const port = 3000;
const cors = require('cors');
// const router = require('./routes/auth');

app.use(cors());
passportConfig(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// force: 서버 실행 시 마다 테이블을 재생성 할 것인지 아닌지
sequelize.sync({ force: false }).then(() => {
    console.log("DB Connected Success");
}).catch((err) => {
    console.error(err);
});

const userRouter = require('./routes/user');
const mainRouter = require('./routes/main');
const commentRouter = require('./routes/comment');
const zzimRouter = require('./routes/zzim');
const searchRouter = require('./routes/search');
const mypageRouter = require('./routes/mypage');
const curationRouter = require('./routes/curation');
const reviewRouter = require('./routes/review');


app.use('/auth', [userRouter]);
app.use([mainRouter, commentRouter, zzimRouter, searchRouter, mypageRouter, curationRouter, reviewRouter]);


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});
