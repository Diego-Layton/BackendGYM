import Mantenimiento from "../models/mantenimiento.js"
import Maquina from "../models/maquinas.js"


const helpersMantenimiento={
    validarIdMaquina:async (idMantenimiento)=>{
        const existe = await Maquina.findById(idMantenimiento)
        if (existe==undefined){
            throw new Error ("Id Maquina no existe")
        }
    },
    validarIdMantenimiento:async (id)=>{
        const existe = await Mantenimiento.findById(id)
        if (existe==undefined){
            throw new Error ("Id Mantenimiento no existe")
        }
    }
}

export default helpersMantenimiento