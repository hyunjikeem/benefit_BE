'use strict';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            // User.hasMany(models.zzim, {
            //     foreignKey: 'userId',
            //     sourceKey: 'userId',
            // });
            // User.hasMany(models.comment, {
            //     foreignKey: 'userId',
            //     sourceKey: 'userId',
            // });
        }
    }
    Comment.init(
        {
            CommentId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            postId: {
                allowNull: false,
                type: Sequelize.INTEGER(100),

            }
        },
        {
            sequelize,
            timstamps: true,
            modelName: 'User',
        },
    );
    return Comment;
};