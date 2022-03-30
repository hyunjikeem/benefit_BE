const { sequelize } = require("../models");
const db = require("../models");
const Policy = db.Policy;
const Zzim = db.Zzim;
const Comment = db.Comment;
const User = db.User;
const Review = db.Review;
const { QueryTypes } = require('sequelize');
const { fn, col } = Policy.sequelize;



// 메인페이지로 줄 정보 
exports.mainpage = async (req, res) => {
  try {
    const todayBest = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location',[fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 
       'view',],
        include : [{
            model: Zzim, 
            required: false,
            attributes: [
              [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
            ],
            where : { userId : 2}
          }],
        order: [['view','DESC']],
        limit: 5,
        raw : true,
        
    });
    
    const c1 = await Policy.findOne({
        attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view'],
        where: { category: '주거·금융' },
        order: [['view','DESC']],
    });
    const c2 = await Policy.findOne({
        attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view'],
        where: { category: '코로나19' },
        order: [['view','DESC']],
    });
    const c3 = await Policy.findOne({
        attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view'],
        where: { category: '창업지원' },
        order: [['view','DESC']],
    });
    const c4 = await Policy.findOne({
        attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view'],
        where: { category: '생활·복지' },
        order: [['view','DESC']],
    });
    const c5 = await Policy.findOne({
        attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view'],
        where: { category: '정책참여' },
        order: [['view','DESC']],
    });
    const c6 = await Policy.findOne({
        attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view'],
        where: { category: '취업지원' },
        order: [['view','DESC']],
    });
    const categoryBest = [c1,c2,c3,c4,c5,c6];

    res.json({ todayBest, categoryBest })
  } catch (error) {
    console.error(error)
    res.status(400).json({ result : 'false'})
  } 
};
// 상세 페이지로 줄 정보 
exports.detailpage = async (req, res) => {
  try {
    const { postId } = req.params; 
    
    let userId = 0;

    if (res.locals.user) {
       userId  = res.locals.user.userId
    }
      
    const post = await Policy.findOne({
        where: { postId: postId },
        attributes:['postId', 'title', 'group', 'location', 'summary', 'category', 
          'benefit_desc', 'benefit', 'apply_period', 'scale', 'age', 'education', 
          'major', 'job_status', 'special', 'process', 'dday', 'apply_site', 
          'operation', 'do_period', 'residence', 'plus', 'submit', 'etc', 
          'maker', 'reference_site1','view',
          [sequelize.literal(`(SELECT count(*) FROM Zzims WHERE postId = ${postId} GROUP BY postId)`),'zzim_count']],
        include : [{
            model: Zzim, 
            required: false,
            attributes: [
              [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
              
            ],
            where : { userId }
          }],
        raw : true
    });
    await Policy.update({ view : Policy.sequelize.literal('view + 1') }, { where: { postId : postId } });
    
    const comment = await sequelize.query(`SELECT c.CommentId as commentId, c.createdAt as insert_time, c.content, replace( u.nickname, substr(u.nickname, 2), '****') as nickname FROM Comments as c 
    INNER JOIN Users as u on u.userId = c.userId WHERE postId =${postId}`,{ type: QueryTypes.SELECT })

    const review = await Review.findAll({
      attributes: ['reviewId','review_link',[sequelize.literal(`CASE WHEN userId = ${userId} THEN true ELSE false END`), 'review_status']],
      where : { postId },
    })

    res.json({ post, comment, review});
  } catch (error) {
    console.error(error)
    res.status(400).json({ result : 'false'})
  }  
};
