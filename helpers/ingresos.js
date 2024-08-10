import Ingreso from "../models/ingresos.js"
import Sede from "../models/sedes.js"
import Cliente from "../models/clientes.js"



const helpersIngresos={
    validarIdSede:async (idSede)=>{
        const existe = await Sede.findById(idSede)
        if (existe==undefined){
            throw new Error ("Id de sede no existe")
        }
    }, 
    validarIdIngreso:async (id)=>{
        const existeingreso = await Ingreso.findById(id)
        if (existeingreso==undefined){
            throw new Error ("Id no existe")
        }
    }, 
    validarIdCliente:async (idCliente)=>{
        const existecliente = await Cliente.findById(idCliente)
        if (existecliente==undefined){
            throw new Error ("Id de cliente no existe")
        }
    }
}

export default helpersIngresos