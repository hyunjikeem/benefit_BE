const express = require("express");
const router = express.Router();

const controller = require("../controller/review");

// 리뷰등록
router.get("/detail/:postId", freeMiddleware, controller.detailpage);


module.exports = router;
