import { buffer } from "micro";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../src/utils/db";
import Stripe from "stripe";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log("AAAAA HOOKS");
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err! instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    // Cast event data to Stripe object.
    if (event.type === "checkout.session.completed") {
      const sessionSuccess = event.data.object as Stripe.Checkout.Session;
      // console.log(`💰 PaymentIntent status: ${JSON.stringify(event.data)}`);

      // const intent = await stripe.paymentIntents.retrieve(
      //   "pi_3LVUW1LegvUgMEDx1qdob0ls"
      // );
      // console.log("💰 PaymentIntent: " + JSON.stringify(intent));

      // const paymentIntents = await stripe.paymentIntents.list({
      //   limit: 10,
      // });
      // console.log("💰 PaymentIntent: " + JSON.stringify(paymentIntents));

      // const sessions = await stripe.checkout.sessions.list({
      //   limit: 3,
      // });

      const { status } = sessionSuccess;

      if (status === "complete") {
        const { job_id, coupon } = sessionSuccess.metadata as any;

        const { user } = await prisma.job.update({
          where: { id: job_id },
          data: { payed: true },
          include: {
            user: true,
          },
        });

        if (coupon) {
          const couponData = await prisma.coupon.findFirst({
            where: { code: coupon },
          });

          const exist = await prisma.usersOnCoupons.findFirst({
            where: {
              user: { id: user!.id },
              coupon: { id: couponData!.id },
            },
          });

          if (!exist) {
            await prisma.usersOnCoupons.create({
              data: {
                user: {
                  connect: {
                    id: user!.id,
                  },
                },
                coupon: {
                  connect: {
                    id: couponData!.id,
                  },
                },
              },
            });
          }
        }
      }

      console.log("💰 PaymentIntent: " + JSON.stringify(sessionSuccess));
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
      );
    } else if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default cors(webhookHandler as any);
