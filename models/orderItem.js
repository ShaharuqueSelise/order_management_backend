import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const OrderItem = sequelize.define("OrderItem", {
    quantity: DataTypes.INTEGER,
    unitPrice: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    totalPrice: DataTypes.FLOAT,
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Orders",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Products",
        key: "id",
      },
    },
});


OrderItem.sync({ alter: true }).then(() => {
    console.log("OrderItem Model synced with table alterations");
  });

export default OrderItem;