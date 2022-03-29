'use strict';
const Sequelize = require('sequelize');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            
            User.hasMany(models.Comment, { foreignKey: 'userId', sourceKey: 'userId', onDelete:'CASCADE' });
            User.hasMany(models.Zzim, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'CASCADE' });
<<<<<<< HEAD
            User.hasMany(models.Review, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'CASCADE' });

=======
        
>>>>>>> 413048a54063ce7704e9348b06f2e855d4b3aa5f
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
            timestamps: true,
            modelName: 'User',
        },
    );
    return User;
};