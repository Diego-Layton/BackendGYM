import mongoose from "mongoose";

const comprasSchema = new mongoose.Schema({
    idProveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    idInventario: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario', required: true },
    fecha: { type: Date, default: Date.now },
    codigo: { type: Number, unique: true, required: true },
    valorUnitario: { type: Number, required: true },
    cantidad: { type: Number, required: true },
    total: { type: Number, default: "" }

})

export default mongoose.model("Compra", comprasSchema)

