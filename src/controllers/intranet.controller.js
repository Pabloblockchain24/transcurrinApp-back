import Service from "../models/service.model.js"

export const getServices = async(req,res)=>{
    try {
        const services = await Service.find();
        res.json(services);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

export const getService = async(req,res)=>{
    const serviceFound = await Service.findById(req.params.id)
    if(!serviceFound) return res.status(404).json({messsage:"Servicio no encontrado"})
    res.json(serviceFound)
}
export const createService = async(req,res)=>{
    const  {ref,container,nave,tipo,diasLibres,eta,almDestino} = req.body
    const newService = await Service.create({
        ref,
        container,
        nave, 
        tipo, 
        diasLibres,
        eta,
        demurrage:diasLibres,
        almDestino,
        depotDevolucion:"",
        retiroPuerto:"",
        choferRetiro:"",
        entrega:"",
        choferEntrega:"",
        fechaVacio:"",
        choferVacio: "",
        facProveedor: "",
        statusFacProveedor: "pendiente",
        user:req.user.id,
        progEntrega: "",
        statusEntrega:"",
        carguioEntrega:""
    })
    res.json(newService)
}
export const deleteService = async(req,res)=>{
    const serviceFound = await Service.findByIdAndDelete(req.params.id)
    if(!serviceFound) return res.status(404).json({messsage:"Servicio no encontrado"})
    // return res.sendStatus(204)
    res.json(serviceFound)

}
export const updateService = async(req,res)=>{
    const  {container, depotDevolucion,retiroPuerto,choferRetiro} = req.body

    const serviceToUpdate = await Service.findOne({container:container})
    serviceToUpdate.depotDevolucion = depotDevolucion
    serviceToUpdate.retiroPuerto = retiroPuerto
    serviceToUpdate.choferRetiro = choferRetiro

    let updateService = await Service.updateOne({container: container}, serviceToUpdate)

    if(!updateService) return res.status(404).json({messsage:"Servicio no encontrado"})
    res.json(updateService)
}

