import mongoose from "mongoose";

const ingresosSchema=new mongoose.Schema({
  idSede:{type:mongoose.Schema.Types.ObjectId,ref:'Sede',required:true},
  fecha:{type:Date,default:Date.now()},
  idCliente:{type:mongoose.Schema.Types.ObjectId,ref:'Cliente',required:true},

})

export default mongoose.model("Ingreso",ingresosSchema)
