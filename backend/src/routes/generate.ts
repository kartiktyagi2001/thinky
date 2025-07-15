import { Hono } from "hono";
import { auth } from "../middlewares/auth";
import z from "zod";
import axios from "axios";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
// import { Mode } from "@prisma/client/edge";



export const generateRouter = new Hono<{
  Bindings: {
    GEMINI_API_KEY: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();

//temp fix
// type ModeType = "PHILOSOPHER" | "DEVLOPER" | "FRIEND";



generateRouter.post("/generate", auth, generateLogic);

async function generateLogic(c) {
  const body = await c.req.json();

  // Initialize Prisma
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Zod validation
  const schema = z.object({
    content: z.string(),
    mode: z.string(),
  });
  const result = schema.safeParse(body);

  if (!result.success) {
    c.status(400);
    return c.json({ message: "Invalid Inputs" });
  }

  const { content, mode } = result.data;
  const userId = c.get("userId");

  // Preset prompts
  const prompts = {
    PHILOSOPHER: "Respond as a Stoic philosopher. Be deep, wise, calm",
    DEVLOPER: "Respond as a senior software developer. Be clear and helpful.",
    FRIEND: "Respond as a caring, casual friend. Be kind and funny and humorous.",
  };

  const prompt = `${prompts[mode]}\n\nUser said/asked: ${content}`;

  try {
    // Gemini API call
    const thinkyResponse = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${c.env.GEMINI_API_KEY}`,
        {
            // keep the same body structure
            contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
            ],
        }
    );


    const thinkyReply =
      thinkyResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "...";

    // await prisma.thought.create({
    //   data: {
    //     content,
    //     response: thinkyReply,
    //     mode,
    //     userId,
    //   },
    // });

    return c.json({
      response: thinkyReply,
    });

  } catch (err) {
    return c.json(
      {
        error: err,
        message: "Thinky API server error. Try again later."
      },
      500
    );
  }
}
