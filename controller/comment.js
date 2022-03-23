const { Comment } = require('../models');

const makeComment = async (req, res) => {
    const { postId, content } = req.body;

    // console.log('콘솔이다!!:', postId, content);
    // const { postId } = req.params;
    const { userId } = res.locals.user;
    // console.log('콘솔이다!!2', userId);

    if (!content) {
        res.status(200).send({
            ok: false,
            errorMessage: '내용을 입력해 주세요',
        });
        return;
    }
    
    try {


        await Comment.create({
            userId,
            postId,
            content,
        });
        return res.status(201).send({
            ok: true,
            message: '댓글이 작성되었습니다.',
        });
    } catch (err) {
        return res.status(200).send({
            ok: false,
            errorMessage: '댓글 작성에 실패하였습니다.'
        });
    }
};

const updateComment = async (req, res) => {
    try {
        // const { CommentId } = req.params;
        const { CommentId, content } = req.body;
        // const { userId } = req.locals.user;
        console.log('this is console', CommentId, content);
        // const { commentId } = req.params;
        // const userId = res.locals.user;

        await Comment.update({ content }, { where: { CommentId } });
        return res.status(201).send({
            ok: true,
            message: '댓글이 수정되었습니다.',
        });
    } catch (err) {
        return res.status(200).send({
            ok: false,
            errorMessage: '댓글 수정에 실패하였습니다.'
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { CommentId } = req.body;
        // const { CommentId } = req.body;
        

        await Comment.destroy({ where: { CommentId } });
        return res.status(201).send ({
            ok: true,
            message: '댓글이 삭제되었습니다.',
        });
    } catch (err) {
        return res.status(200).send({
            ok: false,
            errorMessage: '댓글 삭제에 실패하였습니다.',            
        });
    }
};

module.exports = {
    makeComment,
    updateComment,
    deleteComment,
};