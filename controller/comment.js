const { Comment } = require('../models');

const makeComment = async (req, res) => {
    const { postId, content } = req.body;
    const { userId } = res.locals.user;

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
        
        const commentId = await Comment.findOne({
            attributes: ['CommentId'],
            where: {
                userId,
                postId,
                content,
            }
        })

        return res.status(201).send({
            ok: true,
            commentId,
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
        const { commentId, content } = req.body;
        const { userId } = res.locals.user;
        console.log('this is console', commentId, content);

        await Comment.update({ content }, { where: { CommentId : commentId, userId: userId } });
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
        const { commentId } = req.body;
        const { userId } = res.locals.user;
        console.log(commentId)

        await Comment.destroy({ where: { CommentId : commentId, userId: userId } });
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
