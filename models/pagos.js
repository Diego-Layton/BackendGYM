import mongoose from "mongoose";

const pagosSchema=new mongoose.Schema({
  idCliente:{type:mongoose.Schema.Types.ObjectId,ref:'Cliente',required:true},
  idPlan:{type:mongoose.Schema.Types.ObjectId,ref:'Plan',required:true},
  fecha:{type:Date,default:Date.now},
  valor:{ type: Number, require: true },
  estado:{type:Number,default:1},

})

export default mongoose.model("Pago",pagosSchema)
