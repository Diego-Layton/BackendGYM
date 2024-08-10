import Venta from "../models/ventas.js"
import Inventario from "../models/inventario.js"


const helpersVentas={
    validarIdInventario:async (idInventario)=>{
        const existe = await Inventario.findById(idInventario)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validarIdVentas:async (id)=>{
        const existe = await Venta.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },


  validarCantidadDisponible: async (idInventario, cantidad) => {
    try {
        const inventario = await Inventario.findById(idInventario);
        if (!inventario) {
            throw new Error("Inventario no encontrado");
        }
        if (cantidad > inventario.cantidad) {
            throw new Error("Cantidad excede la disponible en inventario");
        }
        return true;
    } catch (error) {
        throw error;
    }
},
ajustarInventario: async (idInventario, diferencia) => {
    const inventario = await Inventario.findById(idInventario);
    if (!inventario) {
        throw new Error("Producto no encontrado");
    }
    inventario.cantidad -= diferencia;
    if (inventario.cantidad < 0) {
        throw new Error("Cantidad en inventario no puede ser negativa");
    }
    await inventario.save();
}

  
    }

export default helpersVentas