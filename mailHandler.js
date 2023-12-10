const nodemailer = require("nodemailer");
require("dotenv").config();

const senderMail = process.env.SENDER_EMAIL;
const tokenMail = process.env.TOKEN_MAIL;
const testDestinationMail = process.env.TEST_DESTINATION_MAIL;
const certificate = process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const beinvenidoHTML = "<h1>¡ Bienvenido a MUTUO !</h1>";
const mensajeHTML = "<h1>¡ Tenes un mensaje en MUTUO !</h1>";
const AlertaSubject = "Mensaje automatico Mutuo";
const beinvenidaSubject = "Gracias por ser parte de MUTUO";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: senderMail,
    pass: tokenMail,
  },
});

function crearMensajeMail(from, to, subject, html) {
  var objetoMail = {
    Form: from,
    to: to,
    subject: subject,
    html: html,
  };
  return objetoMail;
}

function enviarBienvenida(mail) {
  transporter.sendMail(
    {
      Form: senderMail,
      to: mail,
      subject: "asuntillo",
      html: "<h1>¡ Bienvenido a MUTUO !</h1>",
    },
    (err, info) => {
      if (err) {
        console.log(err);
        return err;
      }
      console.log(info);
    }
    // crearMensajeMail(senderMail, mail, beinvenidaSubject, beinvenidoHTML),
    // (err, info) => {
    //   if (err) {
    //     console.log(err);
    //     return err;
    //   }
    //   console.log(info);
    // }
  );
}

function enviarAlertaDeMensaje(mail) {
  transporter.sendMail(
    crearMensajeMail(senderMail, mail, AlertaSubject, mensajeHTML),
    (err, info) => {
      if (err) {
        console.log(err);
        return err;
      }
      console.log(info);
    }
  );
}

enviarAlertaDeMensaje(testDestinationMail);
