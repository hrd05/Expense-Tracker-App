
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();


exports.getforgotpassword = (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'reset.html'));
}

exports.postforgotpassword = async (req, res) => {
    const email = req.body.email;

    
    try {
        const emailResponse = await sendDummyEmail(email);
        res.status(200).json({ email, emailResponse });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to send email' });
    }
};

async function sendDummyEmail(email) {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // use your email service provider here
        auth: {
            user: 'harshdunkhwal55@gmail.com', // your email
            pass: process.env.PASSWORD // your email password or an app-specific password
        }
    });

    const mailOptions = {
        from: 'harshdunkhwal55@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: 'Hi, this is just a dummy mail for testing.'
    };

    try {
        const emailResponse = await transporter.sendMail(mailOptions);
        return emailResponse;
    } catch (err) {
        console.log('Error sending mail', err);
        throw err;
    }
}