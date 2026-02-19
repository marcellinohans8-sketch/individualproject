"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: "UserId",
      });
    }
  }
  Profile.init(
    {
      bio: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "bio is required",
          },
          notNull: {
            msg: "bio is required",
          },
        },
      },
      education: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "education is required",
          },
          notNull: {
            msg: "education is required",
          },
        },
      },
      consultationFee: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "consultationFee is required",
          },
          notNull: {
            msg: "consultationFee is required",
          },
        },
      },
      availableOnline: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "availableOnline is required",
          },
          notNull: {
            msg: "availableOnline is required",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Profile",
    },
  );
  return Profile;
};
