const express = require("express");
const router = express.Router();

const { authentication } = require("../middlewares/authentication");

const loginRoute = require("./loginRoute");
const registerRoute = require("./registerRoute");
const categoryRoute = require("./categoryRoute");
const profileRoute = require("./profileRoute");
const lawyerRoute = require("./lawyerRoute");
const publicLawyerRoute = require("./publicLawyerRoute");
const paymentRoute = require("./paymentRoute");
const aiRoute = require("./aiRoute");

router.use("/pub", publicLawyerRoute);

router.use("/register", registerRoute);
router.use("/login", loginRoute);
router.use("/categories", categoryRoute);

router.use(authentication);

router.use("/lawyers", lawyerRoute);
router.use("/profiles", profileRoute);
router.use("/payments", paymentRoute);
router.use("/ai", aiRoute);

module.exports = router;
