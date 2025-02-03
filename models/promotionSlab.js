import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const PromotionSlab = sequelize.define("PromotionSlab", {
  minWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  maxWeight: {
    type: DataTypes.FLOAT,
    allowNull: true, // Null means no upper limit
  },
  discountPerUnit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default PromotionSlab;
