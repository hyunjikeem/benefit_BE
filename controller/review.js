const { Review } = require('../models');
const { Op } = require('sequelize');


exports.createZzim = async (req, res) => {
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
                   review_link
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
