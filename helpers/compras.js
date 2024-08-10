import Compra from "../models/compras.js"
import Inventario from "../models/inventario.js"
import Proveedor from "../models/proveedores.js"


const helpersCompras={
    validarIdInventario:async (idInventario)=>{
        const existe = await Inventario.findById(idInventario)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validaridProveedor:async (idProveedor)=>{
        const existe = await Proveedor.findById(idProveedor)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validarIdCompra:async (id)=>{
        const existe = await Compra.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },


  ajustarInventario: async (idInventario, diferencia) => {
    const inventario = await Inventario.findById(idInventario);
    if (!inventario) {
        throw new Error("Producto no encontrado");
    }
    inventario.cantidad = Number(inventario.cantidad) + Number(diferencia);
    await inventario.save();
}
  
    }

export default helpersCompras
