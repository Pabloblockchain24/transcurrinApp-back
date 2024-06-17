import { z } from "zod"

export const registerSchema = z.object({
    name: z.string({
        required_error: "Nombre es required"
    }),
    company: z.string({
        required_error: "Empresa es requerida"
    }),
    email: z.string({
        required_error: "Correo es requerido"
    }).email({
        message: "Correo invalido"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(6, {
        message: "password must be at least 6 characters"
    }),
    // rol: z.string({
    //     required_error: "rol is required"
    // }),
})

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required"
    }).email({
        message: "Invalid email"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(6, {
        message: "password must be at least 6 characters"
    })
})
