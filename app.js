
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import 'dotenv/config'
import  express  from "express"
import dbConexion from "./database/cnxmongoose.js"
import clientes from "./routes/clientes.js"
import compras from "./routes/compras.js"
import ingresos from "./routes/ingresos.js"
import inventario from "./routes/inventario.js"
import mantenimiento from "./routes/mantenimiento.js"
import maquinas from "./routes/maquinas.js"
import pagos from "./routes/pagos.js"
import planes from "./routes/planes.js"
import Proveedores from "./routes/proveedores.js"
import sedes from "./routes/sedes.js"
import usuarios from "./routes/usuarios.js"
import ventas from "./routes/ventas.js"
import cors from 'cors'
import cron from 'node-cron';
import interval from "./routes/interval.js"

import httpClientes from './controllers/clientes.js';  

import "./controllers/cronClientes.js";

cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando cron job para actualizar estados de clientes...');
    await httpClientes.actualizarEstados();
}, {
    scheduled: true,
    timezone: "America/Bogota"  // Ajusta la zona horaria según tu ubicación
});
const app = express()
app.use(express.static('public'))
app.use(cors())
app.use(express.json())
app.use("/api/clientes",clientes)
app.use("/api/compras",compras)
app.use("/api/ingresos",ingresos)
app.use("/api/inventario",inventario)
app.use("/api/mantenimiento",mantenimiento)
app.use("/api/maquinas",maquinas)
app.use("/api/pagos",pagos)
app.use("/api/planes",planes)
app.use("/api/proveedores",Proveedores)
app.use("/api/sedes",sedes)
app.use("/api/usuarios",usuarios)
app.use("/api/ventas",ventas)
app.use("/api/interval",interval)


app.listen(process.env.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    dbConexion()
})
