const db = require("../models");
const Policy = db.Policy;
const Zzim = db.Zzim;
const Comment = db.Comment;
const { fn, col } = Policy.sequelize;



// 메인페이지로 줄 정보 
exports.mainpage = async (req, res) => {
  try {
    const todayBest = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', 'summary', 'location',[fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 
       'view' ],
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
      
    console.log(userId)
    const post = await Policy.findAll({
        where: { postId: postId },
        attributes:['postId', 'title', 'group', 'location', 'summary', 'category', 
        'benefit_desc', 'benefit', 'apply_period', 'scale', 'age', 'education', 
        'major', 'job_status', 'special', 'process', 'dday', 'apply_site', 
        'operation', 'do_period', 'residence', 'plus', 'submit', 'etc', 
        'maker', 'reference_site1', 'reference_site2','view'],
        include : [{
          model: Zzim, 
          required: false,
          attributes: [
            [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
          ],
          where : {userId}
        }],
        raw : true
    });
    await Policy.update({ view : Policy.sequelize.literal('view + 1') }, { where: { postId : postId } });
    
    res.json({ post });
  } catch (error) {
    console.error(error)
    res.status(400).json({ result : 'false'})
  }  
};