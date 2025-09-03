// server.js - Backend server for email sending
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// ===== EMAIL CONFIGURATION - UPDATE THESE VALUES =====
const EMAIL_CONFIG = {
    senderEmail: "blessy.parmar@sxca.edu.in",          
    senderPassword: "nxzw hcxv pvbb dqxm",         
    senderName: "SXC Ahmedabad"
};

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_CONFIG.senderEmail,    
        pass: EMAIL_CONFIG.senderPassword   
    }
});

// API endpoint to send birthday emails
app.post('/api/send-email', async (req, res) => {
    try {
        const { to, subject, html } = req.body;
        
        const mailOptions = {
            from: `${EMAIL_CONFIG.senderName} <${EMAIL_CONFIG.senderEmail}>`,
            to: to,
            subject: subject,
            html: html
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        console.log(`✅ Birthday email sent to: ${to}`);
        res.json({ success: true, message: 'Email sent successfully' });
        
    } catch (error) {
        console.error('❌ Email sending error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve the birthday card page
app.get('/birthday-card', (req, res) => {
    const { name, year } = req.query;
    res.send(`
      <!DOCTYPE html>
        <html>
        <head>
            <title>Birthday Celebration - St. Xavier's College(Autonomous), Ahmedabad</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    background: linear-gradient(135deg, #E63946 0%, #4A90E2 100%); 
                    margin: 0; 
                    padding: 20px; 
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .card { 
                    background: rgba(255,255,255,0.97); 
                    padding: 50px; 
                    border-radius: 25px; 
                    text-align: center; 
                    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
                    max-width: 650px;
                    animation: slideIn 1s ease-out;
                    position: relative;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .logo { 
                    background: linear-gradient(135deg, #003366, #4A90E2); 
                    width: 110px; 
                    height: 110px; 
                    border-radius: 50%; 
                    margin: 0 auto 25px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 34px; 
                    color: white; 
                    font-weight: bold;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }
                h1 { 
                    color: #E63946; 
                    font-size: 3.2em; 
                    margin: 15px 0; 
                    text-shadow: 2px 2px 5px rgba(0,0,0,0.2);
                }
                p { 
                    font-size: 1.3em; 
                    margin: 12px 0; 
                    color: #333; 
                }
                .highlight { 
                    font-size: 1.6em; 
                    color: #4A90E2; 
                    font-weight: bold;
                    text-shadow: 0px 0px 8px rgba(74,144,226,0.5);
                }
                .footer { 
                    margin-top: 40px; 
                    padding-top: 20px; 
                    border-top: 2px solid #FFD700; 
                }
                .footer h3 { 
                    color: #003366; 
                    margin-bottom: 10px; 
                }
                .footer a { 
                    color: #E63946; 
                    margin: 0 12px; 
                    text-decoration: none; 
                    font-weight: bold; 
                    transition: 0.3s;
                }
                .footer a:hover { 
                    color: #4A90E2; 
                    text-decoration: underline;
                }
                .confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: gold;
                    top: -10px;
                    animation: fall 4s infinite linear;
                    opacity: 0.7;
                }
                @keyframes fall {
                    to { transform: translateY(120vh) rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="card">
                <!-- Confetti -->
                <div class="confetti" style="left:10%; animation-delay:0s;"></div>
                <div class="confetti" style="left:30%; animation-delay:1s; background:#E63946;"></div>
                <div class="confetti" style="left:50%; animation-delay:2s; background:#4A90E2;"></div>
                <div class="confetti" style="left:70%; animation-delay:0.5s; background:#FFD700;"></div>
                <div class="confetti" style="left:90%; animation-delay:1.5s; background:#003366;"></div>

                <div class="logo">
                    <img src="/uploads/logo.png" alt="SXCA Logo">
                </div>
                <h1>🎉 Happy Birthday! 🎂</h1>
                <p>Dear <strong>${name || 'Alumni'}</strong>,</p>
                <p>On this special day, <strong>St. Xavier's College (Autonomous), Ahmedabad</strong> celebrates you and the wonderful memories we share.</p>
                <p>Class of <strong>${year || 'Alumni'}</strong></p>
                <p>Thank you for being an integral part of our proud legacy.</p>
                <p class="highlight">✨ May your year ahead be filled with joy, success, and happiness! ✨</p>

                <div class="footer">
                    <h3>St. Xavier's College</h3>
                    <p>
                        <a href="https://sxca.edu.in/about-us/">About Us</a> | 
                        <a href="https://sxca.edu.in/about-us/">Contact</a> | 
                        <a href="#alumni">Alumni Network</a>
                    </p>
                    <p style="font-style: italic; color: #555;">
                        Celebrating our alumni community with love and pride 💙❤️
                    </p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 St. Xavier's Birthday System running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down St. Xavier\'s Birthday System...');
    process.exit(0);
});