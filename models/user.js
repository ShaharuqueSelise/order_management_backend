import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';

const User = sequelize.define("UserTable", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType:{
    type: DataTypes.STRING,
    allowNull: false,
  }
});


// Method to check password
User.prototype.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.sync().then(() => {
  console.log("User Model synced");
});

export default User;
