import { z } from "zod"

export const createServiceSchema = z.object({
    ref: z.string({
        required_error: "ref is required"
    }),
    container: z.string({
        required_error: "Container is required"
    }),
    // nave: z.string({
    //     required_error: "Nave is required"
    // }),
    // producto: z.string({
    //     required_error: "Producto is required"
    // }),
    // diasLibres: z.number({
    //     required_error: "Dias libres is required"
    // }),
    // depotDevolucion: z.string({
    //     required_error: "Deposito de devolucion is required"
    // }),
})