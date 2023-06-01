module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      code: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      cost_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      sales_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      tableName: "products",
      timestamps: false,
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.Pack);
  };

  return Product;
};
