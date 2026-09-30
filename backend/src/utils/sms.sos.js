const nodemailer = require('nodemailer');

async function sendMessage(user , latitude, longitude) {

// console.log(arr);

try{
    const arr = user.emergencyEmails.split(",");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    }
});

await transporter.verify();
console.log("SMTP connection successful");

await transporter.sendMail(mailOptions);
console.log("Email sent successfully");

const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
const mailOptions = {
    from:process.env.NODEMAILER_USER,
    to:arr,
    subject:`🚨Emergency Alert from ${user.name}🚨`,
    html:`<p>Help!!</p>
    <p><b>${user.name}</b> is in an emergency situation and needs your immediate assistance.</p>
    <p>Please contact them at <b>${user.mobile}</b> as soon as possible.</p>
    <p>User blood type: <b>${user.bloodgrp}</b></p>
    <h4><a href="${googleMapsLink}" target="_blank">📍View Location on Maps</a></h4>
    <p>Thank you for your prompt attention to this matter.</p>`
}



await transpoter.sendMail(mailOptions);
console.log("Email sent successfully to emergency contacts.");

}catch(err){
    console.log("Email error:", err);
}
  
}

module.exports = { sendMessage };
