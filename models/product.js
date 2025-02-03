import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
});


// Method to check password
// Product.prototype.checkPassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

Product.sync({ alter: true }).then(() => {
    console.log("Product Model synced with table alterations");
  });

export default Product;