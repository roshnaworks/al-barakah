require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Nodemailer transporter using Gmail App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,     // your gmail address
    pass: process.env.GMAIL_APP_PASS  // 16-character Gmail App Password
  }
});

app.post('/api/reserve', async (req, res) => {
  const { name, email, phone, datetime, notes } = req.body;

  if (!name || !email || !phone || !datetime) {
    return res.status(400).json({ error: 'Please fill all required fields.' });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.RESTAURANT_EMAIL || process.env.GMAIL_USER,
    subject: `New Table Reservation - ${name}`,
    html: `
      <h2>New Reservation Request — Al-Barakah</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Date & Time:</strong> ${datetime}</p>
      <p><strong>Special Requests:</strong> ${notes || 'None'}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reservation sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send reservation. Please try again later.' });
  }
});

app.get('/', (req, res) => {
  res.send('Al-Barakah backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});