const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const controller = require("../controller/review");


// 리뷰등록
router.post("/detail/:postId/link", authMiddleware, controller.createReview);

// 리뷰삭제
router.delete("/review/delete", authMiddleware, controller.deleteReview)

// 찜 폴더 생성
router.post("/folder/create", authMiddleware, controller.createFolder)

// 찜 폴더 수정
router.put("/folder/update", authMiddleware, controller.updateFolder)

// 찜 폴더 삭제
router.delete("/folder/delete", authMiddleware, controller.deleteFolder)

module.exports = router;
