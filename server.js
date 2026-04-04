const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("PrudentHR Database Connected"))
  .catch(err => console.log("DB Connection Error:", err));

// --- Schemas & Models ---

// Lead Schema for the Consultancy Site
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  serviceInterest: String,
  date: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);

// --- API Routes ---

// 1. Submit a Lead (Replaces Firebase Client-side Push)
app.post('/api/leads', async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ message: "Lead captured successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Failed to save lead" });
  }
});

// 2. Admin PIN Check (For HR Saathi Publishing)
app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  // Use environment variable for the PIN
  if (pin === process.env.ADMIN_PIN) {
    res.status(200).json({ authorized: true });
  } else {
    res.status(401).json({ authorized: false, message: "Invalid PIN" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));