import Sede from "../models/sedes.js"

const httpSedes = {

    getSedes: async (req, res) => {
        try {
        const {busqueda} = req.query
        const sede = await Sede.find(
            {
                $or: [
                    { nombre: new RegExp(busqueda, "i") },
                    {ciudad: new RegExp(busqueda, "i")},
                ]
            }
        )
        res.json({sede})
    } catch (error) {
        console.error("Error al obtener sedes :", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }},

    getSedesID: async (req, res) => {
        const { id } = req.params
        const sede = await Sede.findById(id)
        res.json({ sede })
    },
    getSedesactivadas: async (req, res) => {
        try {
            const activadas = await Sede.find({ estado: 1 });
            res.json({ activadas });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener sedes activadas' });
        }
    },

    getSedesdesactivadas: async (req, res) => {
        try {
            const desactivadas = await Sede.find({ estado: 0 })
            res.json({ desactivadas })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener sedes desactivadas' });
        }
        },

    postSedes: async (req, res) => {
        try {
        const {nombre,direccion,telefono,ciudad,horario,estado} = req.body
        const sede = new Sede({nombre,direccion,telefono,ciudad,horario,estado})
        await sede.save()
        res.json({ sede })
    }catch (error) {
        console.log(error);
        res.status(400).json({ error: "No se pudo crear el registro" })
    }
    },

    putSedes: async (req, res) => {
        const { id } = req.params
        const { _id,estado,  ...resto } = req.body
        console.log(resto);

        const sede = await Sede.findByIdAndUpdate(id, resto, { new: true })
        res.json({ sede })
    },

    putSedesActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const sede = await Sede.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!sede) {
                return res.status(404).json({ error: "sede no encontrado" });
            }
            res.json({ sede });
        } catch (error) {
            console.error("Error al activar sede", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putSedesDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const sede = await Sede.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!sede) {
                return res.status(404).json({ error: "sede no encontrado" });
            }
            res.json({ sede });
        } catch (error) {
            console.error("Error al desactivar sede", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

}
export default httpSedes