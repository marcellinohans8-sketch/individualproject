const express = require("express");
const PaymentController = require("../controller/PaymentController");
const router = express.Router();

router.post("/create-transaction", PaymentController.createTransaction);

module.exports = router;
