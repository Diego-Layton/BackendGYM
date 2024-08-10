import mongoose from "mongoose";

const planesSchema=new mongoose.Schema({
 codigo:{type:String, require: true, unique:true},
 descripcion:{type:String,required:true},
valor:{ type: Number, require: true },
dias:{ type: Number,required:true},
estado:{type:Number,default:1},
})

export default mongoose.model("Plan", planesSchema)


