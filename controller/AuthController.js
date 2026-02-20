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
      const { access_token_google } = req.headers;
      if (!access_token_google)
        throw { name: "BadRequest", message: "Google Id is required" };
      const ticket = await client.verifyIdToken({
        idToken: access_token_google,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the WEB_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      if (!payload.email_verified)
        throw { name: "BadRequest", message: "Email not verified" };
      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          password: Date.now().toString() + Math.random().toString(),
          role: "client",
        },
      });
      const access_token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      res.status(201).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AuthController;
