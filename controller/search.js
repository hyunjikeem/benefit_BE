const { Policy } = require('../models');
const { Op } = require('sequelize');
const { serializeUser } = require('passport/lib');
const { fn, col } = Policy.sequelize;


exports.searchResults = async (req, res) => {
    try {
      const {location, benefit} = req.body;
        // const location = filter.location
      let locationWords = [];
      
      for (let i of location) {
          if ( i === 'all') {
            locationWords.push({ location: { [Op.like]: '%%' } })
          } else {
            locationWords.push({ location: { [Op.like]: `%${i}%` } })
          }
      }
      
      let educationWord;
      if (benefit === 'all') {
          educationWord = { benefit: { [Op.like]: '%%' } } 
      } else {
          educationWord = { benefit: { [Op.like]: `%${benefit}%` } }
      }
      
      const c0 = await Policy.findAll({
          attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location'],
          where: {
              [Op.and] : [
                  {category : "주거·금융"},
                  { [Op.or]: locationWords },
                   educationWord,
            ]
          }, 
      });
      


      res.json({ c0 });
    } catch (error) {
      res.status(400).json({ result : 'false'})
    }  
  };