import Sede from "../models/sedes.js"

const helpersSedes={
    validarExistaId:async (id)=>{
        const existe = await Sede.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    }
}

export default helpersSedes