import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Order = sequelize.define("Order", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  weight: DataTypes.FLOAT,
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerName: DataTypes.STRING,
  customerEmail: DataTypes.STRING,
  customerAddress: DataTypes.STRING,
});

Order.sync({ alter: true }).then(() => {
  console.log("Order Model synced with table alterations");
});

export default Order;
