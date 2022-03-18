const { Zzim, Policy, User, Comment } = require('../models');
const { sequelize } = require('../models');

const getZzimList = async (req,res) => {
    try {
        const { userId } = res.locals.user;
    
        // const existUser = await User.findOne({ where: { userId }});
        const existZzim = await Zzim.findAll({ where: { userId }, raw: true });
    
        let ZzimList = [];
        if (existZzim.length === 0) {
            return res.status(200).send({
                ok: false,
                errorMessage: '찜 리스트 조회에 실패하였습니다'
            })
        } else if (existZzim !== 0){
            for (let i = 0; i < existZzim.length; i++) {
                const Zzim = await Policy.findOne({
                    where: {
                        postId: existZzim[i].postId,
                    },
                    attributes: ['postId', 'category', 'benefit', 'title', 'apply_period', 'view', 'operation'],
                });
                ZzimList.push(Zzim);
            }
            res.status(201).send({
                ZzimList,
            });
        }
    } catch(error) {
        console.log(error);
        res.status(201).send({
            ok: false,
            errorMessage: '몰?루',
        });
    }
};


const getCommentList = async (req, res) => {
    try {
        const { userId } = res.locals.user;
        
        const existComment = await Comment.findAll({
            where: { userId }
        });

        let commentList = [];
        if (existComment.length === 0) {
            return res.status(201).send({
                ok: false,
                errorMessage: '댓글 조회에 실패하였습니다',
            });
        } else if (existComment !== 0) {
            for (let i = 0; i < existComment.length; i++) {
                const comments = await Policy.findOne({
                    where: { postId: existComment[i].postId },
                    attributes: ['postId', 'title'],
                    include: [
                        {
                            model: Comment,
                            attributes: ['commentId', 'content', 'createdAt'],
                            where: { userId }
                        }
                    ]
                });
                commentList.push(comments);
            }
        }
        res.status(200).send({
            commentList,
        })
    } catch (error) {
        console.log(error);
        res.status(201).send({
            ok: false,
            errorMessage: '몰?루',
        });
    }
}

module.exports = {
    getZzimList,
    getCommentList,
}