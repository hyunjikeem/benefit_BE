const { Zzim } = require('../models');
const { Zzim_folder } = require('../models');
const { Op } = require('sequelize');


const createZzim = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { folderId, zzim_status } = req.body;


    try {

       const existZzim = await Zzim.findOne({
           where: {
               [Op.and]: [
                   { userId },
                   { postId },
               ],
               [Op.or]: { folderId },
           }
    })

       if (!existZzim) {
               await Zzim.create({ userId, postId, zzim_status: true, folderId: folderId })
               res.status(200).send((result = {
                   ok: true,
               }))
       } else {
               await Zzim.destroy({ where: { userId, postId, folderId: folderId }})
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