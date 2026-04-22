import { Request, Response } from "express"
import z from "zod"
import { prisma } from "../database/prisma"


class TeamController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(3).trim(),
            description: z.string().nullable().optional(),
        })

        const { name, description } = bodySchema.parse(request.body)

        console.log(name, description)

        const team = await prisma.teams.create({
            data: {
                name,
                description,
            }
        })

        return response.status(201).json(team)
    }

    async index(request: Request, response: Response) {
        const teams = await prisma.teams.findMany({})

        return response.json(teams)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string(),
        }).transform(({ id }) => ({ id: parseInt(id, 10) }))

        const bodySchema = z.object({
            name: z.string().min(3).trim().optional(),
            description: z.string().nullable().optional(),
        })

        const { id } = paramsSchema.parse(request.params)
        const { name, description } = bodySchema.parse(request.body)

        await prisma.teams.update({
            where: { id },
            data: {
                name,
                description,
            }
        })

        return response.json({ message: "Team updated successfully" })
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string(),
        }).transform(({ id }) => ({ id: parseInt(id, 10) }))

        const { id } = paramsSchema.parse(request.params)

        await prisma.teams.delete({
            where: { id }
        })

        return response.json({ message: "Team deleted successfully" })
    }
}

export { TeamController }