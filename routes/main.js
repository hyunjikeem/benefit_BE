const express = require("express");
const router = express.Router();
const freeMiddleware = require('../middleware/free-middleware');

const controller = require("../controller/main");

// 메인페이지 
router.get("/main",freeMiddleware, controller.mainpage);

// 상세페이지 
router.get("/detail/:postId", freeMiddleware, controller.detailpage);



module.exports = router;