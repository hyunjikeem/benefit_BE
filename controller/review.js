const { Review, Zzim_folder } = require('../models');
const { Op } = require('sequelize');


exports.createReview = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { review_link } = req.body;
 

    try {
       const exist_link = await Review.findOne({
           where: { review_link }
       })

       if (!exist_link) {
               await Review.create({ 
                   postId,
                   userId,
                   review_link,
                   review_status : true
                })
                const theReview = await Review.findOne({
                    where : {postId, review_link}
                })
                
               res.status(200).send({reviewId : theReview.reviewId})
       } else {
               res.status(200).send({
                   ok: "이미 존재하는 링크입니다?"
               })
       }
    } catch(error){
        console.log(error);
        res.status(400).send({
            ok: false
        })
    }
}

exports.deleteReview = async (req, res) => {
    try {
    const { reviewId } = req.body;
    const { userId } = res.locals.user;
    
    await Review.destroy({where: { reviewId , userId} })
    
    res.status(201).send({ ok: true });

    } catch (error) {
        console.log(error)
        res.status(400).send({
            ok: false
        })
    }

}

exports.createFolder = async (req, res) => {
    const { userId, nickname } = res.locals.user;
    const { folder_name } = req.body;
 
    try {
     
        await Zzim_folder.create({ 
           userId,
           folder_name,
           folder_status : false,
           nickname,
           folder_view : 0,
           folder_content : ""
        })

        const theFolder = await Zzim_folder.findOne({where : {userId, folder_name, folder_status : false}})
                
        res.status(200).send({folderId : theFolder.folderId})
     
    } catch(error){
        console.log(error);
        res.status(400).send({
            ok: false
        })
    }

}

exports.updateFolder = async (req, res) => {
    try {

    const { folderId, folder_name, folder_status, folder_content } = req.body;
    const { userId } = res.locals.user;
    
    await Zzim_folder.update({ folder_name, folder_status, folder_content }, { where: { folderId, userId } });    
    res.status(201).send({ ok: true });

    } catch (error) {

        console.log(error)
        res.status(400).send({ok: false})

    }

}

exports.deleteFolder = async (req, res) => {
    try {
    const { folderId }  = req.body;
    const { userId } = res.locals.user;

    const existfolder = await Zzim_folder.findAll({ where : { userId } })
    
    if (existfolder.length === 1 ) {
        res.status(201).send({ ok: false });

    } else {
        
        await Zzim_folder.destroy({where: { folderId , userId} })
        res.status(201).send({ ok: true });

    }
    
    

    } catch (error) {

        console.log(error)
        res.status(400).send({
            ok: "error"
        })
    }

}
