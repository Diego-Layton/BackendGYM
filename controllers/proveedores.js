import Proveedor from "../models/proveedores.js";
// import { json } from "express";
// import cron from "node-cron"
const httpProveedores = {
    getProveedores: async (req, res) => {
        try {
            const { busqueda } = req.query;
            const proveedor = await Proveedor.find({
                $or: [{ nombre: new RegExp(busqueda, "i") }]
            });
            res.json({ proveedor });
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: "Error al obtener Proveedor" });
        }
    },
    getProveedoresID: async (req, res) => {
        try {
            const { id } = req.params;
            const proveedor = await Proveedor.findById(id);
            if (!proveedor) {
                return res.status(404).json({ err: "Proveedor no encontrado" });
            }
            res.json({ proveedor });
        } catch (error) {
            console.log(error);
            res.status(500).json({ err: "Error al obtener Proveedor" });
        }
    },
    getProveedoractivado: async (req, res) => {
        try {
            const activados = await Proveedor.find({ estado: 1 });
            res.json({ activados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener Proveedor activado' });
        }
    },

    getProveedordesactivado: async (req, res) => {
        try {
        const desactivados = await Proveedor.find({ estado: 0 })
        res.json({ desactivados })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener Proveedor desactivado' });
    }
    },
    postProveedores: async (req, res) => {
        try {
            const {nombre,direccion,telefono,nit,email}=req.body
            const proveedor= new Proveedor({nombre,direccion,telefono,nit,email});
            await proveedor.save()
            console.log(proveedor);
            res.json({ message: "el proveedor fue creado exitosamente ", proveedor });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "No se pudo crear el proveedor" })
        }

    },
    putProveedores:async (req, res) => {
        try {
            const { id } = req.params;
            const { _id, estado, ...resto } = req.body;
        
            const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, resto, { new: true });
        
            res.json({ proveedor: proveedorActualizado });
          } catch (error) {

            console.error("Error updating proveedor:", error);
            res.status(400).json({ error: error.message || "No se pudo actualizar el proveedor" });
          }
    },
    putProveedoresActivar:async (req,res) => {
        const { id } = req.params;
        try {
            const proveedor = await Proveedor.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!proveedor) {
                return res.status(404).json({ error: "proveedor no encontrado" });
            }
            res.json({ proveedor });
        } catch (error) {
            console.error("Error al activar proveedor", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    putProveedoresDesactivar:async (req,res) => {
        const { id } = req.params;
        try {
            const proveedor = await Proveedor.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!proveedor) {
                return res.status(404).json({ error: "proveedor no encontrado" });
            }
            res.json({ proveedor });
        } catch (error) {
            console.error("Error al desactivar proveedor", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

export default httpProveedores