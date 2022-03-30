const { Review } = require('../models');
const { Op } = require('sequelize');


exports.createReview = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { review_link } = res.body;
 

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
               res.status(200).send((result = {
                   ok: true,
               }))
       } else {
               res.status(200).send((result = {
                   ok: "이미 존재하는 링크입니다?"
               }))
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
