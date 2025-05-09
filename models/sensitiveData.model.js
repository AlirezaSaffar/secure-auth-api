const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SensitiveData = sequelize.define("SensitiveData", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  encryptedData: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  iv: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = SensitiveData;
