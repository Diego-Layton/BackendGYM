import mongoose from "mongoose";

const maquinasSchema=new mongoose.Schema({
  idSede:{type:mongoose.Schema.Types.ObjectId,ref:'Sede',required:true},
 codigo:{type:String, require: true, unique:true},
 descripcion:{type:String,required:true},
  fechaIngreso:{type:Date,default:Date.now},
  fechaUltmantenimiento:{type:Date,default:Date.now},
  estado:{type:Number,default:1},

})

export default mongoose.model("Maquina",maquinasSchema)

