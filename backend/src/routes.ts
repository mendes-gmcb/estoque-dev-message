import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import {prisma} from './lib/prisma'
import dayjs from 'dayjs'

export async function AppRoutes(app: FastifyInstance) {
    app.post('/user', async (request) => {
        const postBody  = z.object({
                username: z.string(),
                password: z.string(), 
                email: z.string()       
            })
        const {username, password, email} = postBody.parse(request.body)
        const created_at = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
        const newUser = await prisma.user.create({
            data: {
                username,
                password, 
                email,
                created_at
        }
        })
        return newUser
    })

    app.post('/user/login', async (request) => {
        const postBody  = z.object({
                username: z.string(),
                password: z.string(), 
            })
        const {username, password } = postBody.parse(request.body)
        const user = await prisma.user.findMany({
            where: {
                username: username,
                password: password
            }
        })
        return user
    })

    app.get('/users', async (request) => {
        const users = await prisma.user.findMany()
        return users
    })

    app.get('/messages', async (request) => {
        const messagess = await prisma.message.findMany();
        return messagess

        const messages = await prisma.message.findMany(
        //     {
        //     where: {
        //         published: true
        //     }
        // }
        )
        return messages
    })

    app.post('/message', async (request) => {
        const createMessageBody = z.object({
            title: z.string(),
            content: z.string(),
            userId: z.number()
        })

        const {title, content, userId} = createMessageBody.parse(request.body)
        const likeAmount = 0
        const today = dayjs().startOf('day').toDate() // sem hora, minuto e segundo

        let newMessage = await prisma.message.create({
            data: {
                title,
                content,
                published: false,
                likeAmount,
                created_at: today,
                userId
            }
        })
        return newMessage
    })

    
    app.get('/messages/:userId', async (request) => {
        const userIdParams = z.object({
            userId: z.string()
        })
        const {userId} = userIdParams.parse(request.params)
        const messages = await prisma.message.findMany({
            where: {
                userId: Number(userId)
            }
        })
        return messages
    })

    
    app.patch('/message/:id/like', async (request) => {
        const messageParams = z.object({
            id: z.string(),
        })
        
        const { id } = messageParams.parse(request.params)

        let messageUpdated = await prisma.message.update({
            where: {
                id: Number(id)
            },
            data: {
                likeAmount: {
                    increment: 1
                }
            }
        })

        return messageUpdated.likeAmount
    })

    app.patch('/message/:id/deslike', async (request) => {
        const messageParams = z.object({
            id: z.string(),
        })
        const {id} = messageParams.parse(request.params)

        let messageUpdated = await prisma.message.update({
            where: {
                id: Number(id)
            },
            data: {
                likeAmount: {
                    decrement: 1
                }
            }
        })

        return messageUpdated.likeAmount
    })

    app.patch('/message/:id/published', async (request) => {
        const messageParams = z.object({
            id: z.string(),
        })

        const messageBody = z.object({
            published: z.boolean()
        })

        const {id} = messageParams.parse(request.params)
        const {published} = messageBody.parse(request.body)
        
        let resp = await prisma.message.updateMany({
            where: {
                id: Number(id),
            },
            data: {
                published: published
            }
        })

        return resp
    })

    app.delete('/message/:id', async (request) => {
        const idParam = z.object({
            id: z.string()
        })
        const {id} = idParam.parse(request.params)
        let messageDeleted = await prisma.message.delete({
            where: {
                id: Number(id)
            }
        })
        return messageDeleted
    })
}