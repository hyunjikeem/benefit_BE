const { sequelize } = require('../models');
const { Op } = require('sequelize');
const { type } = require('express/lib/response');
const db = require('../models');
const Policy = db.Policy
const Zzim = db.Zzim
const { fn, col } = db.sequelize;



exports.searchResults = async (req, res) => {
    try {
      
      const {location, benefit, education, job_status, txt, age, major, special_limit, apply_period, paging, category, order } = req.body;

      console.log(category)

      // 더보기 (페이지네이션을 위한 초기작업)
      let c0_paging = 10
      let c1_paging = 10
      let c2_paging = 10
      let c3_paging = 10
      let c4_paging = 10
      let c5_paging = 10
      let c6_paging = 10

      
      for (let i of category) {
        if (i === "c1") {
          c1_paging = Math.ceil((c1_paging * paging) / category.length)
        } else if (i ===  "c2") {
          c2_paging = Math.ceil((c2_paging * paging) / category.length)
        } else if (i ===  "c3") {
          c3_paging = Math.ceil((c3_paging * paging) / category.length)
        } else if (i ===  "c4") {
          c4_paging = Math.ceil((c4_paging * paging) / category.length)
        } else if (i ===  "c5") {
          c5_paging = Math.ceil((c5_paging * paging) / category.length)
        } else if (i ===  "c6") {
          c6_paging = Math.ceil((c6_paging * paging) / category.length)
        } else if (i ===  "all") {
          c0_paging = Math.ceil((c0_paging * paging) / category.length)
        }
      }

      // 정렬을 위한 작업
      let orderCol = 'view'
      let orderHow = 'DESC'

      if (order === "마감임박순") {
        orderCol = 'apply_end'
        orderHow = 'ASC'
      }



      // 유저마다 찜을 했는지 안했는지 다르게 표시해주기 위해
      let userId = 0;

      if (res.locals.user) {
         userId  = res.locals.user.userId
      }

      
      //지원기간 (apply_period)
      const now = new Date();

      const today = new Date(now.setDate(now.getDate()))
      const year = today.getFullYear();
      const month = ('0' + (today.getMonth() + 1)).slice(-2);
      const date = ('0' + today.getDate()).slice(-2);

      const todayString = year + '-' + month  + '-' + date;

      // 14일 후
      const after14 = new Date(now.setDate(now.getDate() + 14))
      const year14 = after14.getFullYear();
      const month14 = ('0' + (after14.getMonth() + 1)).slice(-2);
      const date14 = ('0' + after14.getDate()).slice(-2);

      const string14 = year14 + '-' + month14  + '-' + date14;
     
      
      let applyWords = [];
      for (let i of apply_period) {
          if ( i === 'all') {
            applyWords.push({ [Op.or] : [{ apply_end : { [Op.like]: '%%' } }, { apply_end: { [Op.eq]: null } } ] })
          } else if ( i === '상시') {
            applyWords.push({ apply_end : { [Op.like]: '%상시%' } })
          } else if ( i === '수시') {
            applyWords.push({ apply_end : { [Op.like]: '%수시%' } })
          } else if ( i === '선착순') {
            applyWords.push({ apply_end : { [Op.like]: '%선착%' } })
          } else if ( i === '공모중') {
            applyWords.push({ [Op.and] :  [{ apply_start: { [Op.lte]: todayString } }, { apply_end: { [Op.gte]: todayString } }]} )
          } else if ( i === '마감일 임박 (14일 미만)') {
            applyWords.push({ [Op.and] : [{ apply_start: { [Op.lte]: todayString } },{ apply_end: { [Op.lte]: string14 } }]})
          } else if ( i === '신청 예정 (14일 미만)') {
            applyWords.push({ [Op.and] : [{ apply_start: { [Op.gte]: todayString } },{ apply_start: { [Op.lte]: string14 } }]})
          } else if ( i === '기타') {
            applyWords.push({ apply_end : { [Op.like]: '%상세%' } })
          }
      }


        // 검색창 검색, 검색창 필터
      let txtWords = [];
      if (txt === 'all') {
          txtWords.push({ [Op.or] : [{ title : { [Op.like]: '%%' } }, { title : { [Op.eq]: null } } ] })
      } else {
          txtWords.push({ title: { [Op.like]: `%${txt}%` } })
          txtWords.push({ location: { [Op.like]: `%${txt}%` } })
          txtWords.push({ summary: { [Op.like]: `%${txt}%` } })
          txtWords.push({ benefit_desc: { [Op.like]: `%${txt}%` } })
      }

        // 지역 필터 (location)
      let locationWords = [];
      for (let i of location) {
          if ( i === 'all') {
            locationWords.push({ [Op.or] : [{ location : { [Op.like]: '%%' } }, { location : { [Op.eq]: null } } ] })
          } else {
            locationWords.push({ location: { [Op.like]: `%${i}%` } })
          }
      }
      
      // 교육? 재학상태 필터 (education)
      let educationWords = [];
      if (education === 'all') {
          educationWords.push({ [Op.or] : [{ education : { [Op.like]: '%%' } }, { education : { [Op.eq]: null } } ] }) 
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
            benefitWords.push({ [Op.or] : [{ benefit : { [Op.like]: '%%' } }, { benefit : { [Op.eq]: null } } ] })
        } else {
            benefitWords.push({ benefit: { [Op.like]: `%${i}%` } })
        }
    }

     // 취업 상태 필터 (job_status)
     let jobWords = [];
     if (job_status === 'all') {
          jobWords.push({ [Op.or] : [{ job_status : { [Op.like]: '%%' } }, { job_status : { [Op.eq]: null } } ] }) 
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


     // 나이 제한
     let ageWords = [];
     if (age === 'all') {
        ageWords.push({ [Op.or] : [{ age : { [Op.like]: '%%' } }, { age: { [Op.eq]: null } } ] })
     } else if (age === 'true') {
        ageWords.push({ age: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '-' },]}})
     } else  {
        ageWords.push({ age: { [Op.or] : [ { [Op.like]: '%제한%없음%' }, { [Op.like]: '-' } ]}})
     }

     // 전공 제한
     let majorWords = [];
     if (major === 'all') {
        majorWords.push({ [Op.or] : [{ major : { [Op.like]: '%%' } }, { major: { [Op.eq]: null } } ] })
     } else if (major === 'true') {
        majorWords.push({ major: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '-' },]}})
     } else  {
        majorWords.push({ major: { [Op.or] : [ { [Op.like]: '%제한%없음%' }, { [Op.like]: '-' } ]}})
     }


     // 기타 제한 사항 
     let specialWords = [];
     if (special_limit === 'all') {
        specialWords.push({ [Op.or] : [{ without : { [Op.like]: '%%' } }, { without: { [Op.eq]: null } } ] })
     } else if (special_limit === 'true') {
        specialWords.push({ without: { [Op.and] : [ { [Op.notLike] : '%제한%없음%' }, { [Op.notLike] : '-' },]}})
     } else  {
        specialWords.push({ without: { [Op.or] : [ { [Op.like]: '%제한%없음%' }, { [Op.like]: '-' } ]}})
     }
      

     //전체 뿌리기
      const c00 = await Policy.findAll({
          
          attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 
          'view', 'operation','location','job_status','education','apply_start','apply_end'],
          where: {
              [Op.and] : [
                  {state : "게제중"},
                  { [Op.or]: txtWords },
                  { [Op.or]: locationWords },
                  { [Op.or]: benefitWords },
                  { [Op.or]: educationWords },
                  { [Op.or]: jobWords },
                  { [Op.or]: ageWords },
                  { [Op.or]: majorWords },
                  { [Op.or]: specialWords},
                  { [Op.or]: applyWords },
            ]
          },
          include : [{
            model: Zzim, 
            required: false,
            attributes: [
              [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
            ],
            where : { userId }
          }], 
          raw : true,
          group : 'postId',
          order: [ [ orderCol, orderHow ] ],
      });

      const c0 = c00.slice(0, c0_paging)

  const c11 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "주거·금융"},
              {state : "게제중"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              { [Op.or]: ageWords },
              { [Op.or]: majorWords },
              { [Op.or]: specialWords},
              { [Op.or]: applyWords },
        ]
      }, 
      include : [{
        model: Zzim, 
        required: false,
        attributes: [
          [Zzim.sequelize.literal('CASE WHEN zzim_status = 1 THEN "true" ELSE "false" END'),'zzim_status' ]
        ],
        where : { userId }
      }],
      raw : true,
      group : 'postId',
      order: [ [ orderCol, orderHow ] ],
  });

const c1 = c11.slice(0, c1_paging)

const c22 = await Policy.findAll({
    attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
    where: {
        [Op.and] : [
            {category : "코로나19"},
            {state : "게제중"},
            { [Op.or]: txtWords },
            { [Op.or]: locationWords },
            { [Op.or]: benefitWords },
            { [Op.or]: educationWords },
            { [Op.or]: jobWords },
            { [Op.or]: ageWords },
            { [Op.or]: majorWords },
            { [Op.or]: specialWords},
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
    group : 'postId',
    order: [ [ orderCol, orderHow ] ]
});
const c2 = c22.slice(0, c2_paging)

const c33 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "창업지원"},
              {state : "게제중"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              { [Op.or]: ageWords },
              { [Op.or]: majorWords },
              { [Op.or]: specialWords},
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
      group : 'postId',
      order: [ [ orderCol, orderHow ] ]
});
const c3 = c33.slice(0, c3_paging)
    
const c44 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "생활·복지"},
              {state : "게제중"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              { [Op.or]: ageWords },
              { [Op.or]: majorWords },
              { [Op.or]: specialWords},
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
      group : 'postId',
      order: [ [ orderCol, orderHow ] ]
});
const c4 = c44.slice(0, c4_paging)

    const c55 = await Policy.findAll({
      attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
      where: {
          [Op.and] : [
              {category : "정책참여"},
              {state : "게제중"},
              { [Op.or]: txtWords },
              { [Op.or]: locationWords },
              { [Op.or]: benefitWords },
              { [Op.or]: educationWords },
              { [Op.or]: jobWords },
              { [Op.or]: ageWords },
              { [Op.or]: majorWords },
              { [Op.or]: specialWords},
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
      group : 'postId',
      order: [ [ orderCol, orderHow ] ]
});
const c5 = c55.slice(0, c5_paging)

const c66 = await Policy.findAll({
  attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location','job_status','education','apply_start','apply_end'],
  where: {
      [Op.and] : [
          {category : "취업지원"},
          {state : "게제중"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
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
  group : 'postId',
  order: [ [ orderCol, orderHow ] ]
});
const c6 = c66.slice(0, c6_paging)



const c0_count = await Policy.count({
  where: {
      [Op.and] : [
          {state : "게제중"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
          { [Op.or]: applyWords },
    ]
  },
});
const c1_count = await Policy.count({
  where: {
      [Op.and] : [
          {category : "주거·금융"},
          {state : "게제중"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
          { [Op.or]: applyWords },
    ]
  },
});
const c2_count = await Policy.count({
  where: {
      [Op.and] : [
          {state : "게제중"},
          {category : "코로나19"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
          { [Op.or]: applyWords },
    ]
  },
});
const c3_count = await Policy.count({
  where: {
      [Op.and] : [
          {state : "게제중"},
          {category : "창업지원"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
          { [Op.or]: applyWords },
    ]
  },
});
const c4_count = await Policy.count({
  where: {
      [Op.and] : [
          {state : "게제중"},
          {category : "생활·복지"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
          { [Op.or]: applyWords },
    ]
  },
});
const c5_count = await Policy.count({
  where: {
      [Op.and] : [
          {state : "게제중"},
          {category : "정책참여"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
          { [Op.or]: applyWords },
    ]
  },
});
const c6_count = await Policy.count({
  where: {
      [Op.and] : [
          {state : "게제중"},
          {category : "취업지원"},
          { [Op.or]: txtWords },
          { [Op.or]: locationWords },
          { [Op.or]: benefitWords },
          { [Op.or]: educationWords },
          { [Op.or]: jobWords },
          { [Op.or]: ageWords },
          { [Op.or]: majorWords },
          { [Op.or]: specialWords},
          { [Op.or]: applyWords },
    ]
  },
});

const count = { c0 : c0_count, c1 : c1_count,  c2 : c2_count, c3 : c3_count, c4 :c4_count, c5 : c5_count, c6 :c6_count }
      
      res.json({ c0,c1,c2,c3,c4,c5,c6, count });
    } catch (error) {
      console.log(error)
      res.status(400).json({ result : 'false'})
    }  
  };
