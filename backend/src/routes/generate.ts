import { Hono } from "hono";
import { auth } from "../middlewares/auth";
import z from "zod";
import axios from "axios";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


export const generateRouter = new Hono<{
    Bindings: {
        OPENAI_API_KEY: string,
        JWT_SECRET: string,
        DATABASE_URL: string
    },
    Variables: {
        userId: string
    }
}>();

generateRouter.post('/generate', auth, generateLogic);

async function generateLogic(c) {
    const body = await c.req.json();

    //prisma init
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    const schema = z.object({
        content : z.string(),
        mode: z.enum(['PHILOSOPHER', 'DEVLOPER', 'FRIEND'])
    })
    const result = schema.safeParse(body);

    if(!result.success){
        c.status(400)
        return c.json({message: "Invalid Inputs"})
    }

    const {content, mode} = result.data; //access mode and content if schema is valid
    const userId = c.get('userId');

    //preset the modes, these prompts gets added in front of every message acc to selected mode
    const prompts = {
    PHILOSOPHER: 'Respond as a Stoic philosopher. Be deep, wise, calm',
    DEVLOPER: 'Respond as a senior software developer. Be clear and helpful.',
    FRIEND: 'Respond as a caring, casual friend. Be kind and funny and humourous.'
  }

  const prompt = `${prompts[mode]}\n\n User said/asked: ${content}`

  //gemini api call (had to visit openAi several times)
  try{
    const thinkyResponse = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${c.env.GEMINI_API_KEY}', {
        contents: [
            {
                role: "user",
                parts: [{text: `${prompt[mode]}\n User Said: ${content}`}]
            }
        ]
    })
  


        //final reply to show user and update DB
        const thinkyReply = thinkyResponse.data.choices?.[0]?.message?.content || '...'

        await prisma.thought.create({
            data:{
                content: content,
                response: thinkyReply,
                mode: mode,
                userId: userId
            }
        })

        return c.json({
            response: thinkyReply
        })
    } catch(err){
        return c.json({
            error: "Thinky API server error. Try again later."
        }, 500)
    }
}