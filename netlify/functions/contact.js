const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const { name, email, message } = JSON.parse(event.body);

    // Validate inputs
    if (!name || !email || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "All fields are required." }) };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email address." }) };
    }
    if (message.length > 2000) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Message too long." }) };
    }

    // Create Gmail transporter using App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,       // your Gmail address
        pass: process.env.GMAIL_APP_PASS,   // Gmail App Password (not your real password)
      },
    });

    // Email TO you (notification)
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `📡 New message from ${name} — deevyapatel.com`,
      html: `
        <div style="font-family: monospace; background: #020912; color: #c8e6f0; padding: 2rem; border-radius: 8px;">
          <h2 style="color: #00f5ff; margin-bottom: 1rem;">// NEW PORTFOLIO MESSAGE</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="color:#5a8a9a; padding: 8px 0; width:80px;">NAME</td>
              <td style="color:#fff; padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="color:#5a8a9a; padding: 8px 0;">EMAIL</td>
              <td style="color:#00f5ff; padding: 8px 0;"><a href="mailto:${email}" style="color:#00f5ff;">${email}</a></td>
            </tr>
            <tr>
              <td style="color:#5a8a9a; padding: 8px 0; vertical-align:top;">MESSAGE</td>
              <td style="color:#c8e6f0; padding: 8px 0; line-height:1.6;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
          <p style="color:#5a8a9a; font-size:12px; margin-top:2rem;">Sent from deevyapatel.com contact form</p>
        </div>
      `,
    });

    // Auto-reply TO the sender
    await transporter.sendMail({
      from: `"Deevya Patel" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Got your message — Deevya Patel`,
      html: `
        <div style="font-family: monospace; background: #020912; color: #c8e6f0; padding: 2rem; border-radius: 8px;">
          <h2 style="color: #00f5ff;">// TRANSMISSION RECEIVED</h2>
          <p style="margin: 1rem 0; line-height: 1.7;">Hey ${name},</p>
          <p style="line-height: 1.7; color: #c8e6f0;">Thanks for reaching out! I got your message and will get back to you within 24 hours.</p>
          <p style="margin-top: 1.5rem; color: #5a8a9a;">— Deevya Patel<br>
            <a href="https://deevyapatel.com" style="color:#00f5ff;">deevyapatel.com</a> |
            <a href="https://linkedin.com/in/DeevyaPatel" style="color:#00f5ff;">LinkedIn</a>
          </p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "Message transmitted successfully!" }),
    };
  } catch (err) {
    console.error("Email error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to send message. Please try again." }),
    };
  }
};
