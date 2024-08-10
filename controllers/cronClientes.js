import mongoose from "mongoose";
import cron from "node-cron";
import twilio from "twilio";
import Cliente from "../models/clientes.js"


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


cron.schedule('00 22 * * *', async () => {
    try {
 
      const today = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);
  
 
      const clientes = await Cliente.find({
        fechavencimiento: {
          $gte: today,
          $lte: threeDaysLater
        }
      });

    clientes.forEach(cliente => {
      const mensaje = `Hola ${cliente.nombre}, tu plan en el gimnasio está cerca a vencer . Por favor, realiza el pago para continuar con tu suscripción.`;


      client.messages.create({
        body: mensaje,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+57${cliente.telefono}`
      })
      .then(message => console.log(`Mensaje enviado a ${cliente.nombre}: ${message.sid}`))
      .catch(error => console.error(`Error al enviar mensaje a ${cliente.nombre}:`, error));
    });
  } catch (error) {
    console.error("Error al ejecutar la tarea programada:", error);
  }
});


export default {};
