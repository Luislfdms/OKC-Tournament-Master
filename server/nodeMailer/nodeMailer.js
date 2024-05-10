require("dotenv").config();

const nodeMailer = require('nodemailer')

async function main(email, verificationToken) {

  const html = `
  <h1>Click this link to verify your account</h1>
  <a href="https://mern-project-barker-ceabe269d73c.herokuapp.com/verify/${verificationToken}">Click me to verify!</a>
`;

  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    secure: true,
    auth: {
      user: process.env.NODE_USERNAME,
      pass: process.env.NODE_PASS
    }
  });

  const info = await transporter.sendMail({
    from: 'thebarkauth@gmail.com',
    to: email,
    subject: 'Account authentication for OKC Tournament',
    html: html,
  })
}

module.exports = main