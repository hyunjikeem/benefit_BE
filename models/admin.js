'use strict';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            
            // User.hasMany(models.Comment, { foreignKey: 'userId', sourceKey: 'userId', onDelete:'CASCADE' });
            // User.hasMany(models.Zzim, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'CASCADE' });
        
        }
    }
    Admin.init(
        {
            adminId: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },
            password: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING,
            },
        },
        {
            sequelize,
            timestamps: true,
            modelName: 'Admin',
        },
    );
    return Admin;
};