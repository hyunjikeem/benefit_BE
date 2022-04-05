const { Zzim, Policy, User, Comment, Zzim_folder } = require('../models');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');


const getZzimList = async (req,res) => {
    try {
        const { userId } = res.locals.user;
    
        // const existUser = await User.findOne({ where: { userId }});
        const existZzim = await Zzim_folder.findAll({ where: { userId }, raw: true });
    
        let list = [];
        if (existZzim.length === 0) {
            return res.status(200).send({
                ok: false,
                errorMessage: '찜 리스트 조회에 실패하였습니다'
            })
        } else if (existZzim !== 0){
                const Zzim = await sequelize.query(`SELECT folder_name, folderId, folder_status, folder_content, (select benefit from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1) as benefit, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 0 ) as c1, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 1) as c2, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 2) as c3, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 3) as c4 from Zzim_folders as f where f.userId = ${userId}`, { type: QueryTypes.SELECT });
                list.push(Zzim);
                
            res.status(201).send({
                list,
            });
        }
    } catch(error) {
        console.log(error);
        res.status(201).send({
            ok: false,
            errorMessage: 'Could not fetch zzims',
        });
    }
};


const getCommentList = async (req, res) => {
    try {
        const { userId } = res.locals.user;
        
        const existComment = await Comment.findAll({
            where: { userId }
        });

        if (existComment.length === 0) {
            return res.status(201).send({
                ok: false,
                errorMessage: '댓글 조회에 실패하였습니다',
            });
        } 

        // let comments = await Policy.findAll({
        //     attributes: ['postId', 'title', 'benefit'],
        //     include: [
        //         {
        //             model: Comment,
        //             attributes: ['commentId', 'content', 'createdAt'],
        //             where: { userId }
        //         }
        //     ],
        //     raw: true,
        // });

        const comments = await sequelize.query(`SELECT p.postId, p.title, p.benefit, c.CommentId as commentId, c.content as content, c.createdAt as createdAt FROM policies as p INNER JOIN Comments as c on p.postId = c.postId where userId = ${userId}`, { type: QueryTypes.SELECT })

        res.status(200).send({
            comments,
        })
    } catch (error) {
        console.log(error);
        res.status(201).send({
            ok: false,
            errorMessage: 'Could not fetch comments',
        });
    }
}

module.exports = {
    getZzimList,
    getCommentList,
}