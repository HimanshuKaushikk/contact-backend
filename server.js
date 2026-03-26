require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

// Middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Debug
console.log("API KEY:", process.env.RESEND_API_KEY ? "Loaded" : "Missing");
console.log("EMAIL:", process.env.EMAIL);

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Contact route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false });
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.EMAIL,
      subject: `New Contact from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message}
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

const PORT = 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});