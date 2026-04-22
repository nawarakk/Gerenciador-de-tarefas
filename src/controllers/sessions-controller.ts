import { Request, Response } from "express"
import { AppError } from "../utils/AppError"
import { authConfig } from "../config/auth"
import { prisma } from "../database/prisma"
import { compare } from "bcrypt"
import { z } from "zod"
import jwt from "jsonwebtoken"

class SessionController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            email: z.email(),
            password: z.string().min(6),
        })

        const { email, password } = bodySchema.parse(request.body)
        
        const user = await prisma.users.findFirst({ where: { email } })

        if (!user) {
            throw new AppError("Invalid email or password")
        }
        
        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched) {
            throw new AppError("Invalid email or passwword")
        }

        const { secret, expiresIn } = authConfig.jwt

        const token = jwt.sign({ role: user.role ?? "member"} , secret, {
            subject: String(user.id),
            expiresIn,
        })
        
        return response.status(200).json({ token, user })
    }
}

export { SessionController }