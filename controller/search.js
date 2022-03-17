const { Policy } = require('../models');
const { Op } = require('sequelize');
const { serializeUser } = require('passport/lib');
const { fn, col } = Policy.sequelize;


exports.searchResults = async (req, res) => {
    try {
        const filter = req.body;
        const location = filter.location

      let searchWords = [];
      console.log(searchWords)
      for (let i of location) {
          if ( i === 'all') {
            searchWords.push({ location: { [Op.like]: `%${i}%` } })
          } else {
            searchWords.push({ location: { [Op.like]: `%${i}%` } })
            }
      }
      console.log(searchWords)
      
      const c0 = await Policy.findAll({
          attributes:['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation','location'],
          where: { [Op.or]: searchWords
          }
      });


      res.json({ c0 });
    } catch (error) {
      res.status(400).json({ result : 'false'})
    }  
  };
