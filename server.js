import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Apple Pay verification (.well-known)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tell Express to serve files inside the ".well-known" folder
app.use("/.well-known", express.static(path.join(__dirname, ".well-known")));
app.use(bodyParser.json());
// Apple Pay verification
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/.well-known", express.static(path.join(__dirname, ".well-known")));

// 🔒 Replace this with your real Square Production Access Token
const SQUARE_ACCESS_TOKEN = "EAAAl7Z-GS40w9TYaA2BpZLtuYN3IsxS3mxsELPclP3Ua4cc9Dk7jb2zkD5EWBUc";
const SQUARE_LOCATION_ID = "LEADGZ7813668";

// This route is called by your front-end checkout
app.post("/process-payment", async (req, res) => {
  const { token } = req.body;

  try {
    const response = await fetch("https://connect.squareup.com/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        source_id: token,
        amount_money: {
          amount: 1000, // = $10.00
          currency: "USD",
        },
        location_id: SQUARE_LOCATION_ID,
      }),
    });

    const data = await response.json();
    console.log("✅ Payment result:", data);
    res.json({ success: true, data });
  } catch (error) {
    console.error("🚫 Payment error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
