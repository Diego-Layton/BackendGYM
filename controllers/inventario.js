import Inventario from "../models/inventario.js"
import ContadorI from "../models/contadori.js";

const obtenerSiguienteCodigo = async () => {
    const nombreContador = 'ventas';
    const contadori = await ContadorI.findOneAndUpdate(
      { nombre: nombreContador },
      { $inc: { valor: 1 } },
      { new: true, upsert: true }
    );
    return contadori.valor;
  };


const httpInventario = {

    getInventario: async (req, res) => {
        try {
        const {busqueda} = req.query
        const inventario = await Inventario.find(
            {
                $or: [
                    { descripcion: new RegExp(busqueda, "i") },
                     {codigo: new RegExp(busqueda, "i")},
                ]
            }
        )
        res.json({inventario})
    } catch (error) {
        console.error("Error al obtener sedes :", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }},

getInventarioID: async (req, res) => {
        const { id } = req.params
        const inventario = await Inventario.findById(id)
        res.json({ inventario })
    },
    getInventarioactivado: async (req, res) => {
        try {
            const activados = await Inventario.find({ estado: 1 });
            res.json({ activados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener inventario activado' });
        }
    },

    getInventariodesactivado: async (req, res) => {
        try {
        const desactivados = await Inventario.find({ estado: 0 })
        res.json({ desactivados })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener inventario desactivado' });
    }
    },
    postInventario: async (req, res) => {
        try {
        const {descripcion,valor, cantidad} = req.body
        const codigo = await obtenerSiguienteCodigo();

        const inventario = new Inventario({codigo,descripcion,valor, cantidad})
        await inventario.save()
        res.json({ inventario })
    }catch (error) {
        res.status(400).json({ error: "No se pudo crear el registro" })
    }
    },

    putInventario: async (req, res) => {
        const { id } = req.params
        const { _id, codigo,  ...resto } = req.body
        console.log(resto);

        const inventario = await Inventario.findByIdAndUpdate(id, resto, { new: true })
        res.json({ inventario })
    },
    putInventarioActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const inventario = await Inventario.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!inventario) {
                return res.status(404).json({ error: "inventario no encontrado" });
            }
            res.json({ inventario });
        } catch (error) {
            console.error("Error al activar inventario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putInventarioDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const inventario = await Inventario.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!inventario) {
                return res.status(404).json({ error: "inventario no encontrado" });
            }
            res.json({ inventario });
        } catch (error) {
            console.error("Error al desactivar inventario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

}
export default httpInventario