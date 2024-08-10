

import Compra from "../models/compras.js";
import Proveedor from "../models/proveedores.js";
import Inventario from "../models/inventario.js";
import ContadorC from "../models/contadorc.js";
import helpersCompras from "../helpers/compras.js";

const obtenerSiguienteCodigo = async () => {
  const nombreContador = 'compras';
  const contador = await ContadorC.findOneAndUpdate(
    { nombre: nombreContador },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return contador.valor;
};

const httpCompras = {

getCompras: async (req, res) => {
  try {
    const { busqueda } = req.query;
    let criteria = {};

    if (!isNaN(busqueda)) {
      criteria.codigo = Number(busqueda);
    } else {}

    const compra = await Compra.find(criteria);
    res.json({ compra });
  } catch (error) {
    console.error("Error al obtener compra por busqueda de :", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
},


  getComprasID: async (req, res) => {
    const { id } = req.params;
    const compra = await Compra.findById(id);
    res.json({ compra });
  },

  getComprasporproveedor :async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await Compra.find({ idProveedor: id });
        res.json({ compra });
    } catch (error) {
        console.error("Error al obtener compras por ID de proveedor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
},
getComprasporproducto :async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Compra.find({ idInventario: id });
        res.json({ venta });
    } catch (error) {
        console.error("Error al obtener ventas por ID de producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
},

getComprasPorFecha: async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: 'Fechas de inicio y fin son requeridas' });
    }

    const compra = await Compra.find({
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      }
    });

    res.json({ compra });
  } catch (error) {
    console.error('Error al obtener las compras por fecha:', error);
    res.status(500).json({ message: 'Error al obtener las compras por fecha' });
  }
},

postCompras: async (req, res) => {
    try {
        const { idProveedor, idInventario, valorUnitario, cantidad } = req.body;
        const total = valorUnitario * cantidad;
        const codigo = await obtenerSiguienteCodigo();

        const compra = new Compra({ idProveedor, idInventario, codigo, valorUnitario, cantidad, total });
        await compra.save();

        await helpersCompras.validarIdInventario(idInventario);
        await helpersCompras.ajustarInventario(idInventario, cantidad);

        res.json({ compra });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message || "No se pudo crear el registro" });
    }
},

putCompras: async (req, res) => {
    try {
        const { id } = req.params;
        const { valorUnitario, idInventario, cantidad } = req.body;

        await helpersCompras.validarIdInventario(idInventario);

        const compraOriginal = await Compra.findById(id);
        if (!compraOriginal) {
            throw new Error("Compra no encontrada");
        }

        const diferencia = cantidad - compraOriginal.cantidad;

        const compraActualizada = await Compra.findByIdAndUpdate(id, { valorUnitario, idInventario, cantidad }, { new: true });

        await helpersCompras.ajustarInventario(idInventario, diferencia);

        res.json({ compra: compraActualizada });
    } catch (error) {
        console.error("Error actualizando compras:", error);
        res.status(400).json({ error: error.message || "No se pudo actualizar la compra" });
    }
}

};

export default httpCompras;
