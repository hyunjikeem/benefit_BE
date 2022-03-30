const { sequelize } = require("../models");
// const db = require("../models");
// const Policy = db.Policy;
// const Zzim = db.Zzim;
// const Zzim_folder = db.Zzim_folder;
const { QueryTypes } = require('sequelize');

const curationpage = async (req, res) => {
    try{
        const curationlist = await sequelize.query

    } catch(error) {
        console.log(error);
        res.status(201).send({
            ok: false,
            errorMessage: "Invalid access"
        });
    }
};

const folderpage = async (req, res) => {
    try {
        const { folderId } = req.params;

        const postlist = await sequelize.query('SELECT p.postId, p.category, p.benefit, p.title, p.apply_period, p.location FROM ybrn_db.Zzim_folders as zf LEFT JOIN ybrn_db.Zzims as z ON z.folderId = zf.folderId LEFT JOIN ybrn_db.policies as p ON z.postId = p.postId', { type: QueryTypes.SELECT });
        
        console.log(postlist);
        res.json({ postlist });
    } catch(error) {
        console.log(error);
        res.status(201).send({
            ok: false,
            errorMessage: 'Invalid access'
        })
    }
};


  module.exports = {
      curationpage,
      folderpage,
  };