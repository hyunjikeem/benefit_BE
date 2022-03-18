const { Zzim } = require('../models');
const { Op } = require('sequelize');


const createZzim = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { zzim_status }  = req.body;


    try {
       const existZzim = await Zzim.findOne({
           where: { userId, [Op.or]: { postId } }
       })

       if (!existZzim) {
               await Zzim.create({ userId, postId, zzim_status: true })
               res.status(200).send((result = {
                   ok: true,
               }))
       } else {
               await Zzim.destroy({ where: { userId, postId }})
               res.status(200).send((result = {
                   ok: false,
               }))
       }
    } catch(error){
        console.log(error);
        res.status(200).send({
            ok: false,
            errorMessage: 'zzim fail'
        })
    }
}

module.exports = {
    createZzim,
};