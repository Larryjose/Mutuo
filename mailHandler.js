const nodemailer = require('nodemailer')
require('dotenv').config();

const senderMail = process.env.SENDER_EMAIL;
const tokenMail = process.env.TOKEN_MAIL;
const testDestinationMail = process.env.TEST_DESTINATION_MAIL;

const beinvenidoHTML = '<h1>¡ Bienvenido a MUTUO !</h1>'
const mensajeHTML = '<h1>¡ Tenes un mensaje en MUTUO !</h1>' 
const AlertaSubject = 'Mensaje automatico Mutuo'
const beinvenidaSubject = 'Gracias por ser parte de MUTUO'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderMail,
        pass: tokenMail,
    }
})

function crearMensajeMail(from, to, subject, html) {
    var objetoMail = {
      Form: from,
      to: to,
      subject: subject,
      html: html
    };
    return objetoMail;
}

export function enviarBienvenida(mail){
    transporter.sendMail(crearMensajeMail(senderMail, mail, beinvenidaSubject, beinvenidoHTML), (err, info) => {
        if(err) {
            console.log(err)
            return err
        }
        console.log(info)
    })
}

export function enviarAlertaDeMensaje(mail){
    transporter.sendMail(crearMensajeMail(senderMail, mail, AlertaSubject, mensajeHTML), (err, info) => {
        if(err) {
            console.log(err)
            return err
        }
        console.log(info)
    })
}

