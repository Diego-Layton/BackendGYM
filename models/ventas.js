
import mongoose from "mongoose";

const ventasSchema = new mongoose.Schema({
  idInventario: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario', required: true },
  fecha: { type: Date, default: Date.now },
  codigo: { type: Number, unique: true, required: true },
  valorUnitario: { type: Number, required: true },
  cantidad: { type: Number, required: true },
  total: { type: Number, default: "" }
});

export default mongoose.model("Venta", ventasSchema);
