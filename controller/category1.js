const { Policy } = require('../models');
const { fn, col } = Policy.sequelize;
const { Op } = require('sequelize');
const { Sequelize, sequelize } = require('../models')


const getPolicy = async (req, res) => {

    const { category } = req.params;

    const temp = {
        c0 : '전체',
        c1: '주거·금융',
        c2: '코로나19',
        c3: '창업지원',
        c4: '생활·복지',
        c5: '정책참여',
        c6: '취업지원'
    } 
    
    let temp2 = temp[`${category}`];
    
    try {
        const cZero = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            order: [['view', 'DESC']],
        });
        const cOne = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '주거·금융' },
            order: [['view', 'DESC']],
        });

        const cTwo = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '코로나19' },
            order: [['view', 'DESC']],
        });

        const cThree = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '창업지원' },
            order: [['view', 'DESC']],
        });

        const cFour = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '생활·복지' },
            order: [['view', 'DESC']],
        });

        const cFive = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '정책참여' },
            order: [['view', 'DESC']],
        });
        
        const cSix = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '취업지원' },
            order: [['view', 'DESC']],
        });
        const cZip = [cZero, cOne, cTwo, cThree, cFour, cFive, cSix];

        res.json({ cZip });

    } catch(error) {
        res.status(400).json({ result: 'false' })
        }

}
    

module.exports = {
    getPolicy
}