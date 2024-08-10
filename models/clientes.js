import mongoose from "mongoose";

const clientesSchema = new mongoose.Schema({
  nombre: { type: String, require: true },
  fechaIngreso: { type: Date, default: Date.now()},
  documento: { type: String, required: true, unique: true },
  direccion: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  telefono: { type: String, required: true},
  observaciones: { type: String, default:"" },
  estado: { type: Number, default: 0 },
  idPlan:{type:mongoose.Schema.Types.ObjectId,ref:'Plan',required:true},
  fechavencimiento: { type: Date},
  foto: { type: String, required: true },
  seguimiento: [
    {
      fecha: { type: Date, default: Date.now},
      peso: { type: Number, default:1 },
      imc: { type: Number, default:1 },
      brazo: { type: Number, default:1 },
      altura: { type: Number, default:1 },
      edad: { type: Number, default:1 },
    },
  ],
});

export default mongoose.model("Cliente",clientesSchema);
