const express = require("express");
const router = express.Router();
const freeMiddleware = require('../middleware/free-middleware');

const controller = require("../controller/main");

// 메인페이지 신상품
router.get("/main", controller.mainpage);

// 서브페이지 베스트
router.get("/detail/:postId", controller.detailpage);


module.exports = router;