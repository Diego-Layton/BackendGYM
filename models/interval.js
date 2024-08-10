import mongoose from "mongoose";

const intervalSchema=new mongoose.Schema({
 estado: { type: Number, default: 1 },
})

export default mongoose.model("Interval",intervalSchema)
