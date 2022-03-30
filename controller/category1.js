const { Policy } = require('../models');
const { fn, col } = Policy.sequelize;
const { Op } = require('sequelize');
const { Sequelize, sequelize } = require('../models')


const getPolicy = async (req, res) => {
    try {

        const c0 = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            order: [['view', 'DESC']],
        });
        const c1 = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '주거·금융' },
            order: [['view', 'DESC']],
        });

        const c2 = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '코로나19' },
            order: [['view', 'DESC']],
        });

        const c3 = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '창업지원' },
            order: [['view', 'DESC']],
        });

        const c4 = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '생활·복지' },
            order: [['view', 'DESC']],
        });

        const c5 = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '정책참여' },
            order: [['view', 'DESC']],
        });
        
        const c6 = await Policy.findAll({
            attributes: ['postId', 'category', 'benefit', 'title', [fn('concat', col('apply_start'), ' ~ ', col('apply_end')), "apply_period"], 'view', 'operation'],
            where: { category: '취업지원' },
            order: [['view', 'DESC']],
        });


        const cZip = {
            c0 : c0,
            c1 : c1,
            c2 : c2,
            c3 : c3,
            c4 : c4,
            c5 : c5,
            c6 : c6
        }

        res.json({ cZip });

    } catch(error) {
        res.status(400).json({ result: 'false' })
        }

}
    

module.exports = {
    getPolicy
}