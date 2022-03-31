const { Policy } = require('../models');
const { Op } = require('sequelize');
const { Zzim } = require('../models');
const { type } = require('express/lib/response');
const { fn, col } = Policy.sequelize;


exports.searchResults = async (req, res) => {
    try {
      
      const {location, benefit, education, job_status, txt, limit, special_limit, apply_period, paging, category, order } = req.body;


      // 더보기 (페이지네이션을 위한 초기작업)
      let c0_paging = 10
      let c1_paging = 10
      let c2_paging = 10
      let c3_paging = 10
      let c4_paging = 10
      let c5_paging = 10
      let c6_paging = 10

      
      for (let i of category) {
        if (i === "주거·금융") {
          c1_paging = parseInt((c1_paging * paging) / category.length)
        } else if (i ===  "코로나19") {
          c2_paging = parseInt((c2_paging * paging) / category.length)
        } else if (i ===  "창업지원") {
          c3_paging = parseInt((c3_paging * paging) / category.length)
        } else if (i ===  "생활·복지") {
          c4_paging = parseInt((c4_paging * paging) / category.length)
        } else if (i ===  "정책참여") {
          c5_paging = parseInt((c5_paging * paging) / category.length)
        } else if (i ===  "취업지원") {
          c6_paging = parseInt((c6_paging * paging) / category.length)
        } else if (i ===  "all") {
          c0_paging = parseInt((c0_paging * paging) / category.length)
        }
      }

      let orderCol = 'view'
      let orderHow = 'DESC'

      if (order === "마감임박순") {
        
      }



      // 유저마다 찜을 했는지 안했는지 다르게 표시해주기 위해
      let userId = 0;

      if (res.locals.user) {
         userId  = res.locals.user.userId
      }

      
      //지원기간 (apply_period)
      const today = new Date();
      // const fourteen = new Date(now.setDate(now.getDate() + 14))
      // const year = today.getFullYear();
      // const month = ('0' + (today.getMonth() + 1)).slice(-2);
      // const day = ('0' + today.getDate()).slice(-2);

      // const dateString = year + '-' + month  + '-' + day;
      
      
      let applyWords = [];
      for (let i of apply_period) {
          if ( i === 'all') {
            applyWords.push({ apply_period: { [Op.like]: '%%' } })
          } else if ( i === '상시') {
            applyWords.push({ apply_end : "2022-12-31" })
          } else if ( i === '선착순') {
            applyWords.push({ apply_period: { [Op.or] : [ { [Op.like]: '%소진%' }, { [Op.like]: '선착' } ]}})
          } else if ( i === '공모중') {
            applyWords.push({ [Op.and] :  [{ apply_start: { [Op.lte]: today } }, { apply_end: { [Op.gte]: today } }]} )
          } else if ( i === '마감일 임박 (14일 미만)') {
            // applyWords.push({ [Op.and] : [{ apply_start: { [Op.lte]: today } },{ apply_end: { [Op.lte]: fourteen } }]})

          }
      }


        // 검색창 검색, 검색창 필터
      let txtWords = [];
      if (txt === 'all') {
          txtWords.push({ title: { [Op.like]: '%%' } })
      } else {
          txtWords.push({ title: { [Op.like]: `%${txt}%` } })
          txtWords.push({ summary: { [Op.like]: `%${txt}%` } })
          txtWords.push({ benefit_desc: { [Op.like]: `%${txt}%` } })
      }

        // 지역 필터 (location)
      let locationWords = [];
      for (let i of location) {
          if ( i === 'all') {
            locationWords.push({ location: { [Op.like]: '%%' } })
          } else {
            locationWords.push({ location: { [Op.like]: `%${i}%` } })
          }
      }
      
      // 교육? 재학상태 필터 (education)
      let educationWords = [];
      if (education === 'all') {
          educationWords.push({ education: { [Op.like]: '%%' } }) 
      } else if (education === '대학생 (재학,대학생)') {
          educationWords.push({ education: { [Op.like]: '%재학%' } })
          educationWords.push({ education: { [Op.like]: '%대학생%' } })
      } else if (education === "대학원생 (석사, 박사 다 포함)") {
          educationWords.push({ education: { [Op.like]: '%석사%' } })
          educationWords.push({ education: { [Op.like]: '%박사%' } })
          educationWords.push({ education: { [Op.like]: '%대학원%' } })
      } else if (education === "제한없음") {
          educationWords.push({ education: { [Op.like]: '%제한%없음%' } })
      } else {
          educationWords.push({ education: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '%박사%' }, { [Op.notLike] : '%재학%' }, { [Op.notLike] : '%석사%' }, { [Op.notLike] : '%대학생%' }, { [Op.notLike] : '%대학원%' },]}})
      }
      
    // 혜택 유형 필터 (benefit)
      let benefitWords = [];
      for (let i of benefit) {
        if ( i === 'all') {
            benefitWords.push({ benefit: { [Op.like]: '%%' } })
        } else {
            benefitWords.push({ benefit: { [Op.like]: `%${i}%` } })
        }
    }

     // 취업 상태 필터 (job_status)
     let jobWords = [];
     if (job_status === 'all') {
          jobWords.push({ job_status: { [Op.like]: '%%' } }) 
     } else if (job_status === '미취업') {
          jobWords.push({ job_status: { [Op.like]: '%미취업%' } })
     } else if (job_status === "자영업") {
          jobWords.push({ job_status: { [Op.like]: '%자영업%' } })
     } else if (job_status === "창업") {
          jobWords.push({ job_status: { [Op.like]: '%창업%' } })
     } else if (job_status === "제한없음") {
          jobWords.push({ job_status: { [Op.like]: '%제한%없음%' } })
     } else if (job_status === "구직자 / 취업준비생") {
          jobWords.push({ job_status: { [Op.like]: '%구직자%' } })
          jobWords.push({ job_status: { [Op.like]: '%취업%준비%' } })
     } else if (job_status === "재직자(중소포함)") {
          jobWords.push({ job_status: { [Op.like]: '%재직자%' } })
          jobWords.push({ job_status: { [Op.like]: '%중소%' } })
     } else {
          jobWords.push({ job_status: { [Op.and] : [ { [Op.notLike] : '%미취업%' }, { [Op.notLike] : '%자영업%' }, { [Op.notLike] : '%창업%' }, { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '%구직자%' }, { [Op.notLike] : '%취업%준비%' },{ [Op.notLike] : '%재직자%' },{ [Op.notLike] : '%중소%' },]}})
     } 

     // 전공, 나이 제한 (job, major)
     let limitWords = [];
     let limit_status = { [Op.or]: limitWords }
     if (limit === 'all') {
        limitWords.push({ age: { [Op.like]: '%%' } })
     } else if (limit === 'true') {
        limitWords.push({ age: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '-' },]}})
        limitWords.push({ major: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '-' },]}})
     } else  {
        limit_status = { [Op.and] : limitWords }
        limitWords.push({ age: { [Op.or] : [ { [Op.like]: '%제한%없음%' }, { [Op.like]: '-' } ]}})
        limitWords.push({ major: { [Op.or] : [ { [Op.like]: '%제한%없음%' }, { [Op.like]: '-' } ]}})
     }

     // 기타 제한 사항 
     let specialWords = [];
     let special_status = { [Op.or]: specialWords }
     if (special_limit === 'all') {
        specialWords.push({ special: { [Op.like]: '%%' } })
     } else if (special_limit === 'true') {
        specialWords.push({ special: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '-' },]}})
        specialWords.push({ without: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '-' },]}})
     } else  {
        special_status = { [Op.and] : specialWords }
        specialWords.push({ special: { [Op.or] : [ { [Op.like]: '%제한%없음%' }, { [Op.like]: '-' } ]}})
        specialWords.push({ without: { [Op.or] : [ { [Op.like]: '%제한%없음%' }, { [Op.like]: '-' } ]}})
     }
      

     //전체 뿌리기
      const c0 = await Policy.findAll({
          attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
          where: {
              [Op.and] : [
                  { [Op.or]: txtWords },
                  { [Op.or]: locationWords },
                  { [Op.or]: benefitWords },
                  { [Op.or]: educationWords },
                  { [Op.or]: jobWords },
                  limit_status,
                  special_status,
                  { [Op.or]: applyWords },
            ]
          },
          include : [{
            model: Zzim, 
            required: false,
            attributes: [
              [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
            ],
            where : { userId },
          }], 
          raw : true,
          limit : c0_paging,
          order: [ [ orderCol, orderHow ] ]
      });

    const c1 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "주거·금융"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              limit_status,
              special_status,
              { [Op.or]: applyWords },
        ]
      }, 
      include : [{
        model: Zzim, 
        required: false,
        attributes: [
          [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
        ],
        where : { userId}
      }],
      raw : true,
      limit : c1_paging
  });
  const c2 = await Policy.findAll({
    attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
    where: {
        [Op.and] : [
            {category : "코로나19"},
            { [Op.or]: txtWords },
            { [Op.or]: locationWords },
            { [Op.or]: benefitWords },
            { [Op.or]: educationWords },
            { [Op.or]: jobWords },
            limit_status,
            special_status,
            { [Op.or]: applyWords },
      ]
    }, 
    include : [{
      model: Zzim, 
      required: false,
      attributes: [
        [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
      ],
      where : { userId : userId},
    }],
    raw : true,
    limit : c2_paging
});
    const c3 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "창업지원"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              limit_status,
              special_status,
              { [Op.or]: applyWords },
        ]
      }, 
      include : [{
        model: Zzim, 
        required: false,
        attributes: [
          [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
        ],
        where : { userId },
      }],
      raw : true,
      limit : c3_paging
});
    const c4 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "생활·복지"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              limit_status,
              special_status,
              { [Op.or]: applyWords },
        ]
      }, 
      include : [{
        model: Zzim, 
        required: false,
        attributes: [
          [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
        ],
        where : { userId },
      }],
      raw : true,
      limit : c4_paging
});
    const c5 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "정책참여"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              limit_status,
              special_status,
              { [Op.or]: applyWords },
        ]
      }, 
      include : [{
        model: Zzim, 
        required: false,
        attributes: [
          [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
        ],
        where : { userId},
      }],
      raw : true,
      limit : c5_paging
});
const c6 = await Policy.findAll({
  attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
  where: {
      [Op.and] : [
          {category : "취업지원"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          limit_status,
          special_status,
          { [Op.or]: applyWords },
    ]
  }, 
  include : [{
    model: Zzim, 
    required: false,
    attributes: [
      [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
    ],
    where : { userId},
  }],
  raw : true,
  limit : c6_paging,
});
      
      res.json({ c0,c1,c2,c3,c4,c5,c6 });
    } catch (error) {
      console.log(error)
      res.status(400).json({ result : 'false'})
    }  
  };