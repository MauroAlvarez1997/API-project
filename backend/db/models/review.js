'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(models.ReviewImage, {
        onDelete: 'CASCADE',
        foreignKey: 'reviewId',
        hooks: true
      });
      Review.belongsTo(models.User, {
        // onDelete: 'CASCADE',
        foreignKey: 'userId',
        // hooks: true
      });
      Review.belongsTo(models.Spot, {
        // onDelete: 'CASCADE',
        foreignKey: 'spotId',
        // hooks: true
      });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
