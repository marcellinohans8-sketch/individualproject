const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.create({ email, password, role: "client" });
      res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "EmailBadReq" };
      if (!password) throw { name: "PassBadReq" };
      const user = await User.findOne({
        where: { email },
      });

      if (!user) throw { name: "LoginError" };
      if (!comparePassword(password, user.password))
        throw { name: "LoginError" };
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      const access_token = signToken(payload);
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { googleToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name } = payload;

      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          name,
          email,
          password: Math.random().toString(36),
          role: "client",
        });
      }

      const access_token = signToken({ id: user.id, email: user.email });

      res.status(200).json({
        message: "Login success",
        data: { access_token, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AuthController;
