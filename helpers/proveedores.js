import Proveedor from "../models/proveedores.js";
const helpersProveedores={
    validarExistaId:async (id)=>{
        const existe = await Proveedor.findById(id)
        if (existe==undefined){
            throw new Error ("Id Proveedor no existe")
        }
    }, 
    correoExiste: async (correo) => {
        const existe = await Proveedor.findOne({ correo });
        if (existe) {
            throw new Error("El correo electrónico ya está registrado");
        }
    },
    correoExisteExceptoPropio: async (correo, id) => {
        const existe = await Proveedor.findOne({ correo, _id: { $ne: id } });
        if (existe) {
            throw new Error("El correo electrónico ya está registrado por otro usuario");
        }
    },
}

export default helpersProveedores