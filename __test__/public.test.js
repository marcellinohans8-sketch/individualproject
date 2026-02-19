const request = require("supertest");
const app = require("../app");
const { sequelize, Lawyer, Category, User } = require("../models");

let userId;

/* ======================================================
   SEED DATA BEFORE TEST
====================================================== */
beforeAll(async () => {
  // reset table
  await Lawyer.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Category.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });

  // categories
  await Category.bulkCreate([
    {
      id: 1,
      name: "Hukum Pidana",
      description: "Pidana",
    },
    {
      id: 2,
      name: "Hukum Perdata",
      description: "Perdata",
    },
  ]);

  // user lawyer dummy
  const user = await User.create({
    email: "lawyer@test.com",
    password: "123456",
    role: "lawyer",
  });

  userId = user.id;

  // create MANY lawyers (pagination butuh banyak data)
  const lawyers = [];

  for (let i = 1; i <= 20; i++) {
    lawyers.push({
      fullName: `Lawyer ${i}`,
      officeAddress: "Jakarta",
      rating: 4.5,
      photoUrl: "https://img.com/photo.jpg",
      UserId: userId,
      CategoryId: i % 2 === 0 ? 1 : 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await Lawyer.bulkCreate(lawyers);
});

/* ======================================================
   GET PUBLIC LIST
====================================================== */
describe("GET /pub/lawyers (Public List)", () => {
  test("success get lawyers without filter", async () => {
    const res = await request(app).get("/pub/lawyers");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("success get lawyers with category filter", async () => {
    const res = await request(app).get("/pub/lawyers?CategoryId=1");

    expect(res.status).toBe(200);

    res.body.data.forEach((el) => {
      expect(el.CategoryId).toBe(1);
    });
  });

  test("success get lawyers with pagination", async () => {
    const res = await request(app).get("/pub/lawyers?page=2");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });
});

/* ======================================================
   GET DETAIL
====================================================== */
describe("GET /pub/lawyers/:id (Public Detail)", () => {
  test("success get lawyer detail", async () => {
    const res = await request(app).get("/pub/lawyers/1");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("fullName");
  });

  test("fail get lawyer because id not found", async () => {
    const res = await request(app).get("/pub/lawyers/9999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });
});

/* ======================================================
   SEARCH & SORT
====================================================== */
describe("GET /pub/lawyers search & sort", () => {
  test("search lawyer by fullName", async () => {
    const res = await request(app).get("/pub/lawyers?search=1");

    expect(res.status).toBe(200);

    res.body.data.forEach((el) => {
      expect(el.fullName).toMatch(/1/i);
    });
  });

  test("sort lawyer DESC", async () => {
    const res = await request(app).get("/pub/lawyers?sort=DESC");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("sort lawyer ASC", async () => {
    const res = await request(app).get("/pub/lawyers?sort=ASC");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

/* ======================================================
   CLOSE DB CONNECTION
====================================================== */
afterAll(async () => {
  await sequelize.close();
});
