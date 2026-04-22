import request from "supertest"
import { app } from "../app"
import { prisma } from "../database/prisma"


describe("UsersController", () => {
    let user_id: number

    afterAll(async () => {
        await prisma.users.delete({ where: { id: user_id }})
    })

    it("should create a new user successfully", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email: "testuser@example.com",
            password: "password123"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("Test User")

        user_id = Number(response.body.id)
    })

    it("should throw an error if user with same email already exists", async () => {
        const response = await request(app).post("/users").send({
            name: "Duplicate User",
            email: "testuser@example.com",
            password: "password123"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("A user with the same email address already exists")
    })

    it("should throw a validation error if email is invalid", async () => {
        const response = await request(app).post("/users").send({
            name:"Test User",
            email: "invalid-email",
            password: "password123"
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error")
    })
}) 