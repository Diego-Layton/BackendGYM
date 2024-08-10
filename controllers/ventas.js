

import Venta from "../models/ventas.js";
import Inventario from "../models/inventario.js";
import Contador from "../models/contador.js";
import helpersVentas from "../helpers/ventas.js";

const obtenerSiguienteCodigo = async () => {
  const nombreContador = 'ventas';
  const contador = await Contador.findOneAndUpdate(
    { nombre: nombreContador },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return contador.valor;
};

const httpVentas = {

getVentas: async (req, res) => {
  try {
    const { busqueda } = req.query;
    let criteria = {};

    if (!isNaN(busqueda)) {
      criteria.codigo = Number(busqueda);
    } else {}

    const venta = await Venta.find(criteria);
    res.json({ venta });
  } catch (error) {
    console.error("Error al obtener ventas por busqueda de :", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
},


  getVentasID: async (req, res) => {
    const { id } = req.params;
    const venta = await Venta.findById(id);
    res.json({ venta });
  },

  getVentasporproducto :async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Venta.find({ idInventario: id });
        res.json({ venta });
    } catch (error) {
        console.error("Error al obtener ventas por ID de producto:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
},

getVentasPorFecha: async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: 'Fechas de inicio y fin son requeridas' });
    }

    const ventas = await Venta.find({
      fecha: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      }
    });

    res.json({ ventas });
  } catch (error) {
    console.error('Error al obtener las ventas por fecha:', error);
    res.status(500).json({ message: 'Error al obtener las ventas por fecha' });
  }
},

  postVentas: async (req, res) => {
    try {
      const { idInventario, valorUnitario, cantidad } = req.body;
      const total = valorUnitario * cantidad;
      const codigo = await obtenerSiguienteCodigo();

      const venta = new Venta({ idInventario, codigo, valorUnitario, cantidad, total });
      await venta.save();

      const inventario = await Inventario.findById(idInventario);
      if (!inventario) {
        return res.status(404).json({ error: 'Inventario no encontrado' });
      }
      inventario.cantidad -= cantidad;
      await inventario.save();

      res.json({ venta });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message || "No se pudo crear el registro" });
    }
  },

  putVentas: async (req, res) => {
    try {
        const { id } = req.params;
        const { valorUnitario, idInventario, cantidad } = req.body;

        await helpersVentas.validarIdInventario(idInventario);
        await helpersVentas.validarCantidadDisponible(idInventario, cantidad);

        const ventaOriginal = await Venta.findById(id);
        if (!ventaOriginal) {
            throw new Error("Venta no encontrada");
        }

        const diferencia = cantidad - ventaOriginal.cantidad;

        const ventaActualizada = await Venta.findByIdAndUpdate(id, { valorUnitario, idInventario, cantidad }, { new: true });

        await helpersVentas.ajustarInventario(idInventario, diferencia);

        res.json({ venta: ventaActualizada });
    } catch (error) {
        console.error("Error updating ventas:", error);
        res.status(400).json({ error: error.message || "No se pudo actualizar la venta" });
    }
}
};

export default httpVentas;
