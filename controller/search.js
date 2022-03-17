const { Policy } = require('../models');
const { Op } = require('sequelize');
const { serializeUser } = require('passport/lib');
const { fn, col } = Policy.sequelize;


exports.searchResults = async (req, res) => {
    try {
      const {location, benefit, education } = req.body;
      
        // 지역 필터 (location)
      let locationWords = [];
      for (let i of location) {
          if ( i === 'all') {
            locationWords.push({ location: { [Op.like]: '%%' } })
          } else {
            locationWords.push({ location: { [Op.like]: `%${i}%` } })
          }
      }
      
      // 학력? 교육? 필터 (education)
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
        educationWords.push({ education: { [Op.notLike]: { [Op.any] : ['%제한%없음%','%박사%','%석사%','%대학%','%재학%'] } }})
      }
    //   educationWord = { benefit: { [Op.like]: `%${benefit}%` } }
      
    // benefit 필터
      let benefitWords = [];
      for (let i of benefit) {
        if ( i === 'all') {
          benefitWords.push({ benefit: { [Op.like]: '%%' } })
        } else {
          benefitWords.push({ benefit: { [Op.like]: `%${i}%` } })
        }
    }
      
      const c1 = await Policy.findAll({
          attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location'],
          where: {
              [Op.and] : [
                //   {category : "주거·금융"},
                  { [Op.or]: locationWords },
                  { [Op.or]: benefitWords}, 
                  { [Op.or]: educationWords },
                //   educationWord,
            ]
          }, 
      });
      


      res.json({ c1 });
    } catch (error) {
      res.status(400).json({ result : 'false'})
    }  
  };
