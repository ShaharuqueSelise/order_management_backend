import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Promotion = sequelize.define("Promotion", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountType: {
    type: DataTypes.ENUM("percentage", "fixed", "weighted"),
    allowNull: false,
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: true, // Not required for weighted type
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null means global promotion
  },
});

export default Promotion;
