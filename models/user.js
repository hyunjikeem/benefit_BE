'use strict';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
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
    User.init(
        {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            snsId: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            nickname: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING,
            },
            providerType: {
                allowNull: false,
                type: Sequelize.STRING
            }
        },
        {
            sequelize,
            timstamps: true,
            modelName: 'User',
        },
    );
    return User;
};