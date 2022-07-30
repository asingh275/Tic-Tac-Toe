require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Signup

const sendEmail = (req, res, next) => {
  const { to, gameID, userName } = req.body;
  const msg = {
    to: { email: to },
    from: "asingh275@mylangara.ca",
    subject: "Game Invitation to Let's Play!",
    text: `${userName} has invited you to play a game. Here is the game ID ${gameID}.`,
    html: `<div style="background-color:black;color:white;height:200px"><h1 style="text-align:center;">Let's play</h1><strong>${userName} has invited you to play a game. Here is the game ID ${gameID}.</strong></div>`,
  };
  sgMail
    .send(msg)
    .then((result) => {
      res.json({
        message: "Email sent successfully",
        from: msg.from,
        to: msg.to,
      }).status(200);
    })
    .catch((error) => {
      res.json({
        message: "Encounter error while sending email",
        error,
        from: msg.from,
        to: msg.to,
      }).status(500);
    });
};

module.exports = { sendEmail };
