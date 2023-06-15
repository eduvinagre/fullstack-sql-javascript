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
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
          sales_price: {
               type: DataTypes.DECIMAL(10, 2),
               allowNull: false,
          },
     },
     {
          tableName: "products",
          timestamps: false,
     }
     );

     Product.associate = (models) => {

          Product.hasMany(models.Pack, {

               foreignKey: "product_id",
               otherKey: "pack_id",
               as: "pack"
          });


     };

     return Product;
};
