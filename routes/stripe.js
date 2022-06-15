const router = require("express").Router();
const stripe = require("stripe")(process.env."sk_test_51JyuqHSFiHGN0dpnzBZIeFZv9rKKfYMdJl0ay94aPekhKEiCfrDIiVLvWbzNpRlngZ7n3C4OqHZrCOwGTdYpMWaA00fp7o8pGp");

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: Number(req.body.amount)*100,
      currency: "inr",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;