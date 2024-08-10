import mongoose from 'mongoose';

const contadoriSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  valor: { type: Number, default: 1000 }
});

export default mongoose.model('ContadorC', contadoriSchema);
