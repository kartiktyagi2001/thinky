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

  //openai api call (had to visit openAi several times)
  const thinkyResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
        {role: 'system', content: prompts[mode]},
        {role: 'user', content}
    ]
  }, {
    headers: {
        Authorization: `Bearer ${c.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    }
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
}