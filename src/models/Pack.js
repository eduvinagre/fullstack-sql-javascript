const Product = require("./Product");

module.exports = (sequelize, DataTypes) => {
  const Pack = sequelize.define(
    "Pack",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      pack_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "packs",
      timestamps: false,
    }
  );

  // Pack.associate = (models) => {
  //   Pack.belongsToMany(models.Product, {
  //     foreignKey: "pack_id",
  //     as: "pack",
  // });
  // // Pack.belongsToMany(models.Product, {
  //   foreignKey: "product_id",
  //   as: "product",
  // });
  // };

  return Pack;
};
