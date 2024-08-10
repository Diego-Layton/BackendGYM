import mongoose from "mongoose";

const usuariosSchema=new mongoose.Schema({
    idSede:{type:mongoose.Schema.Types.ObjectId,ref:'Sede',required:true},
    nombre:{type:String,required:true},
    email:{type:String,unique:true},
    telefono:{type:String,required:true},
    password:{type:String,required:true},
    rol:{type:String,required:true},
    estado:{type:Number,default:1},
})

export default mongoose.model("Usuario",usuariosSchema)


