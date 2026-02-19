"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lawyer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lawyer.belongsTo(models.User, {
        foreignKey: "UserId",
      });

      Lawyer.belongsTo(models.Category, {
        foreignKey: "CategoryId",
      });
    }
  }
  Lawyer.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "fullName is required",
          },
          notNull: {
            msg: "fullName is required",
          },
        },
      },
      officeAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "officeAddress is required",
          },
          notNull: {
            msg: "officeAddress is required",
          },
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "rating is required",
          },
          notNull: {
            msg: "rating is required",
          },
        },
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "photoUrl is required",
          },
          notNull: {
            msg: "photoUrl is required",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Lawyer",
    },
  );
  return Lawyer;
};
