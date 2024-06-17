import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    code:String,
    producto:String,
    chofer_entrega:String,
    hora_carguio:String,
    hora_descarga:String,
    fecha_entrega:String,
    carpeta:String,
    fecha_retiro: String,
    almacen_destino: String,
    dep_DEV: String
})

const Service = mongoose.model("service", serviceSchema)

export default Service