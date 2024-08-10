import mongoose from "mongoose";

const sedeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, require: true },
  telefono: { type: String, require: true },
  ciudad: { type: String, require: true},
  horario: { type: String, require: true},
  estado: { type: Number, default: 1 },
  createAt: { type: Date, default: Date.now() },
});

export default mongoose.model("Sede", sedeSchema);
