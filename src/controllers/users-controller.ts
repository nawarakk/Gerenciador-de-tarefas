import { Request, Response } from "express"
import { z } from "zod"
import { hash } from "bcrypt"   
import { prisma } from "../database/prisma"
import { AppError } from "../utils/AppError"

class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(2),
            email: z.string().email(),
            password:z.string().min(6),
        })

        const { name, email, password } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.users.findFirst({ where: { email } })

        if(userWithSameEmail){
            throw new AppError("A user with the same email address already exists")
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        
        return response.status(201).json(user)
    }
}

export { UsersController }