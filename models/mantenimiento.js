import mongoose from "mongoose";

const mantenimientoSchema=new mongoose.Schema({
  idMantenimiento:{type:mongoose.Schema.Types.ObjectId,ref:'Maquina',required:true},
  fecha:{type:Date,default:Date.now()},
  descripcion:{type:String,required:true},
  responsable:{type:String,required:true},
  valor:{ type: Number, require: true },

})

export default mongoose.model("Mantenimiento",mantenimientoSchema)


