const { sequelize } = require("../models");
const db = require("../models");
const Policy = db.Policy;
const Zzim = db.Zzim;
const Zzim_folder = db.Zzim_folder;
const { col } = Policy.sequelize;
const { QueryTypes } = require('sequelize');

const curationpage = async (req, res) => {
    try{
        
        const curationlist = await sequelize.query('SELECT folder_name, folderId, userId, nickname, (select benefit from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1) as benefit, (select p.category from Zzims as z  INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 0 ) as c1, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 1) as c2, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 2) as c3, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 3) as c4 from Zzim_folders as f  where f.folder_status = 1;', { type: QueryTypes.SELECT })
        

        res.json({ curationlist });

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

        await Zzim_folder.update({ folder_view : Zzim_folder.sequelize.literal('folder_view + 1') }, { where: { folderId } });

        const maincuration = await sequelize.query(`SELECT folder_name, folderId, userId, nickname, folder_view, (select benefit from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1) as benefit, (select p.category from Zzims as z  INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 0 ) as c1, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 1) as c2, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 2) as c3, (select p.category from Zzims as z INNER JOIN policies as p on z.postId = p.postId and f.folderId = z.folderId limit 1 offset 3) as c4 from Zzim_folders as f  WHERE f.folderId = ${folderId}`, { type: QueryTypes.SELECT })
        const postlist = await sequelize.query(`SELECT p.postId, p.category, p.benefit, p.title, p.apply_period, p.location FROM ybrn_db.Zzim_folders as zf LEFT JOIN ybrn_db.Zzims as z ON z.folderId = zf.folderId LEFT JOIN ybrn_db.policies as p ON z.postId = p.postId WHERE zf.folderId = ${folderId}`, { type: QueryTypes.SELECT });
        

        res.json({ maincuration, postlist });
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