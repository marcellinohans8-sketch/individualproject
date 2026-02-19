const snap = require("../helpers/midtrans");

class PaymentController {
  static async createTransaction(req, res, next) {
    try {
      const { price, lawyerId, duration } = req.body;

      const parameter = {
        transaction_details: {
          order_id: "ORDER-" + Date.now(),
          gross_amount: price,
        },

        item_details: [
          {
            id: lawyerId,
            price: price,
            quantity: 1,
            name: `Konsultasi ${duration} menit`,
          },
        ],

        customer_details: {
          first_name: "Customer",
          email: "customer@mail.com",
        },
      };

      const transaction = await snap.createTransaction(parameter);

      res.json({
        token: transaction.token,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
