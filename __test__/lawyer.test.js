const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

let access_token;
let lawyerId;

/* ======================================================
   BEFORE ALL
====================================================== */
beforeAll(async () => {
  await sequelize.queryInterface.bulkDelete("Lawyers", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  // INSERT ADMIN
  const [admin] = await sequelize.queryInterface.bulkInsert(
    "Users",
    [
      {
        email: "admin@mail.com",
        password: hashPassword("123456"),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { returning: true },
  );

  // INSERT CATEGORIES
  const categories = require("../data/categories.json");

  categories.forEach((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
  });

  await sequelize.queryInterface.bulkInsert("Categories", categories);

  access_token = signToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
});

/* ======================================================
   AFTER ALL
====================================================== */
afterAll(async () => {
  await sequelize.close();
});
describe("LAWYER CRUD", () => {
  describe("POST /lawyers (Create Lawyer)", () => {
    test("success create lawyer", async () => {
      const res = await request(app)
        .post("/lawyers")
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          CategoryId: 1,
          fullName: "John Lawyer",
          officeAddress: "Jakarta",
          rating: 4.5,
          photoUrl: "https://photo.com/a.jpg",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("lawyer");

      lawyerId = res.body.lawyer.id;
    });

    test("fail create lawyer because not login", async () => {
      const res = await request(app).post("/lawyers").send({
        fullName: "No Auth",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    test("fail create lawyer because invalid token", async () => {
      const res = await request(app)
        .post("/lawyers")
        .set("Authorization", "Bearer salah_token")
        .send({
          fullName: "Invalid",
        });

      expect(res.status).toBe(401);
    });

    test("fail create lawyer because validation error", async () => {
      const res = await request(app)
        .post("/lawyers")
        .set("Authorization", `Bearer ${access_token}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /lawyers/:id (Update Lawyer)", () => {
    test("success update lawyer", async () => {
      const res = await request(app)
        .put(`/lawyers/${lawyerId}`)
        .set("Authorization", `Bearer ${access_token}`)
        .send({
          CategoryId: 1,
          fullName: "Updated Lawyer",
          officeAddress: "Bandung",
          rating: 5,
          photoUrl: "https://photo.com/b.jpg",
        });

      expect(res.status).toBe(200);
      expect(res.body.lawyer.fullName).toBe("Updated Lawyer");
    });

    test("fail update because not login", async () => {
      const res = await request(app)
        .put(`/lawyers/${lawyerId}`)
        .send({ fullName: "Hack" });

      expect(res.status).toBe(401);
    });

    test("fail update because invalid token", async () => {
      const res = await request(app)
        .put(`/lawyers/${lawyerId}`)
        .set("Authorization", "Bearer invalid")
        .send({ fullName: "Hack" });

      expect(res.status).toBe(401);
    });

    test("fail update because id not found", async () => {
      const res = await request(app)
        .put("/lawyers/999")
        .set("Authorization", `Bearer ${access_token}`)
        .send({ fullName: "Not Found" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /lawyers/:id (Delete Lawyer)", () => {
    test("success delete lawyer", async () => {
      const res = await request(app)
        .delete(`/lawyers/${lawyerId}`)
        .set("Authorization", `Bearer ${access_token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Lawyer has been deleted");
    });

    test("fail delete because not login", async () => {
      const res = await request(app).delete("/lawyers/1");

      expect(res.status).toBe(401);
    });

    test("fail delete because invalid token", async () => {
      const res = await request(app)
        .delete("/lawyers/1")
        .set("Authorization", "Bearer invalid");

      expect(res.status).toBe(401);
    });

    test("fail delete because id not found", async () => {
      const res = await request(app)
        .delete("/lawyers/999")
        .set("Authorization", `Bearer ${access_token}`);

      expect(res.status).toBe(404);
    });
  });
});
