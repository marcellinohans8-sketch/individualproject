const { verifyToken } = require("../helpers/jwt");
const { User, Lawyer } = require("../models");

async function authentication(req, res, next) {
  try {
    console.log("HEADER:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw { name: "Unauthorized" };
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token);
    console.log("PAYLOAD:", payload);
    const user = await User.findByPk(payload.id);

    if (!user) throw { name: "Unauthorized" };

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

const authorization = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;
    const lawyerId = req.params.id;

    if (role === "admin") return next();

    if (role === "client") {
      throw { name: "Forbidden" };
    }

    const lawyer = await Lawyer.findByPk(lawyerId);
    if (!lawyer) throw { name: "NotFound" };

    if (lawyer.UserId !== userId) {
      throw { name: "Forbidden" };
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication, authorization };
