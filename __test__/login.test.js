const request = require("supertest");
const app = require("../app");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize } = require("../models");

let access_token;

/* ======================================================
   BEFORE ALL → INSERT DATA ADMIN
====================================================== */
beforeAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  const users = require("../data/users.json");

  users.forEach((el) => {
    el.password = hashPassword(el.password);
    el.createdAt = el.updatedAt = new Date();
  });

  await sequelize.queryInterface.bulkInsert("Users", users);
});

/* ======================================================
   LOGIN ADMIN TEST
====================================================== */
describe("POST /login (Admin)", () => {
  // ✅ SUCCESS LOGIN
  test("success login & return access_token", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@mail.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    expect(typeof res.body.access_token).toBe("string");
  });

  // ❌ EMAIL NOT PROVIDED
  test("email not provided", async () => {
    const res = await request(app).post("/login").send({
      password: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // ❌ PASSWORD NOT PROVIDED
  test("password not provided", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@mail.com",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  // ❌ EMAIL NOT REGISTERED
  test("email not registered", async () => {
    const res = await request(app).post("/login").send({
      email: "notfound@mail.com",
      password: "123456",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  // ❌ WRONG PASSWORD
  test("wrong password", async () => {
    const res = await request(app).post("/login").send({
      email: "admin@mail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
