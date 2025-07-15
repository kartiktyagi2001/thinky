import {Hono} from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode, sign, verify} from 'hono/jwt'
import z from 'zod';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

userRouter.post('/signup', signupLogic)
userRouter.post('/signin', signinLogic)

async function signupLogic(c){

    //test log


    //init prisma
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    //zod validation
    const signupSchema = z.object({
        email: z.string(),
        name: z.string(),
        password: z.string().min(3, 'Password must be at least 3 characters long'),
    })

    const {success} = signupSchema.safeParse(body)

    if(!success){
        return c.json({
            message: "Inputs required"
        }, 411);
    }

    try{
        const user = await prisma.user.create({
            data:{
                email: body.email,
                name: body.name,
                password: body.password
            }
        });

        const token = await sign({id: user.id}, c.env.JWT_SECRET)

        return c.json({
            jwt: token,
            name: user.name,
            message: `Welcome ${user.name}!`
        })

    } catch(err){
        c.status(403)
        return c.json({
            error: err
        });
    }
}

async function signinLogic(c){

    //init prisma
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    //zod validation
    const signinSchema = z.object({
        email: z.string(),
        password: z.string().min(3, 'Password must be at least 3 characters long'),
    })

    const {success} = signinSchema.safeParse(body)

    if(!success){
        return c.json({
            message: "Inputs required"
        }, 411);
    }

    try{
        const user = await prisma.user.findUnique({
            where:{
                email: body.email,
                password: body.password
            }
        });

        if (!user) {
            c.status(401)
            return c.json({
                message: "Wrong Credentials"
            }, 401);
        }

        const token = await sign({id: user.id}, c.env.JWT_SECRET)

        return c.json({
            jwt: token,
            name: user.name,
            message: `Welcome ${user.name}!`
        })
        
    } catch(err){
        c.status(403)
        return c.json({
            error: err
        });
    }
}