const router = require("express").Router();
const stripe = require("stripe")(
  "sk_test_51JyuqHSFiHGN0dpnzBZIeFZv9rKKfYMdJl0ay94aPekhKEiCfrDIiVLvWbzNpRlngZ7n3C4OqHZrCOwGTdYpMWaA00fp7o8pGp"
);

router.post("/payment", async (req, res) => {
  try {
    // Create the PaymentIntent
    let intent;
    if (req.body.payment_method_id) {
      intent = await stripe.paymentIntents.create({
        payment_method: req.body.payment_method_id,
        description: "Test payment",
        amount: req.body.amount * 100,
        currency: "inr",
        confirmation_method: "manual",
        confirm: true,
      });
    } else if (req.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
        req.body.payment_intent_id
      );
    }
    res.send(generateResponse(intent));
  } catch (e) {
    // Display error on client
    return res.send({ error: e.message });
  }
});

const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (intent.status === "requires_action" && intent.next_action.type === "use_stripe_sdk") {
    // Tell the client to handle the action
    return {
      requires_action: true,
      next_action: intent.next_action.type,
      payment_intent_client_secret: intent.client_secret,
      // auth_url: intent.next_action.use_stripe_sdk.stripe_js,
    };
  }
   else if (intent.status === "succeeded") {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    };
  } 
  else {
    // Invalid status
    return {
      error: intent,
    };
  }
};
module.exports = router;
