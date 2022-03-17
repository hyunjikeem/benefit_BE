const { Comment } = require('../models');

const makeComment = async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = res.locals.user;

    try {
        if (!content) {
            res.status(200).send({
                ok: false,
                errorMessage: '내용을 입력해 주세요',
            });
            return;
        }

        await Comment.create({
            postId,
            content,
            userId,
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
        const { content } = req.body;
        const { commentId } = req.params;
        // const userId = res.locals.user;

        await Comment.update({ content }, { where: { commentId } });
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
        const { commentId } = req.params;
        // const userId = res.locals.user;

        await Comment.destory({ where: { commentId } });
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