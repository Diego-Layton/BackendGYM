import mongoose from 'mongoose';

const contadormSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  valor: { type: Number, default: 1000 }
});

export default mongoose.model('ContadorM', contadormSchema);
