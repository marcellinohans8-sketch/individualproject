const bcrypt = require("bcryptjs");

const hashPassword = (pass) => {
  return bcrypt.hashSync(pass, 10);
};

const comparePassword = (pass, hashPass) => {
  return bcrypt.compareSync(pass, hashPass);
};

module.exports = { hashPassword, comparePassword };
