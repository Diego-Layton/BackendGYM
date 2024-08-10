import mongoose from "mongoose";

const proveedorSchema = new mongoose.Schema({
    nombre:{type: String,required:true},
    direccion:{type: String,required:true},
    telefono:{type: String,required:true},
    nit:{type: String,required:true},
    email:{type: String,required:true, unique:true},
    estado:{type:Number,default:1},
})

export default mongoose.model("Proveedor", proveedorSchema)
