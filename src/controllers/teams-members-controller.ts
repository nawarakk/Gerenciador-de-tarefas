import { Request, Response } from "express"
import z from "zod"
import { prisma } from "../database/prisma"

class TeamMembersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            user_id: z.string(),
            team_id: z.string(),
        }).transform(({ user_id, team_id }) => ({ user_id: parseInt(user_id, 10), team_id: parseInt(team_id, 10) }))

        const { user_id, team_id } = bodySchema.parse(request.body)

        const existingMember = await prisma.teamMembers.findFirst({
            where: {
                userId: user_id,
                teamId: team_id
            }
        });

        if (existingMember) {
            return response.status(400).json({ message: `User ${user_id} is already a member of team ${team_id}` });
        }


        await prisma.teamMembers.create({
            data: {
                userId: user_id,
                teamId: team_id
            }
        })

        return response.status(201).json({ message: `Member ${user_id} added successfully in team ${team_id}` })
    }

    async delete(request: Request, response: Response) {
        
         const paramsSchema = z.object({
                    id: z.string(),
                }).transform(({ id }) => ({ id: parseInt(id, 10) }))
        
                const { id } = paramsSchema.parse(request.params)
        
                await prisma.teamMembers.delete({
                    where: { id }
                })

        return response.json({ message: `Member removed from team successfully` })
    }

    async index(request: Request, response: Response) {
         const teamMembers = await prisma.teamMembers.findMany({})

        return response.json(teamMembers)
    }
}

export { TeamMembersController }

