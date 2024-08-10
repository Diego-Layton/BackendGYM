import Maquina from "../models/maquinas.js"
import Sede from "../models/sedes.js"


const helpersMaquinas={
    validarIdSede:async (idSede)=>{
        const existe = await Sede.findById(idSede)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validarIdMaquina:async (id)=>{
        const existe = await Maquina.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    }
}


export default helpersMaquinas