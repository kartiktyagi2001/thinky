import { MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";


export const auth : MiddlewareHandler = async(c, next)=> {
    const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];

  if (!token) {
    c.status(401);
    return c.json({ message: "Authorization token missing" });
  }

  try {
    const response = await verify(token, c.env.JWT_SECRET);

    if (response.id) {
      c.set("user_id", response.id);   //set user_id to be used in signup route
      await next();
    } else {
      c.status(403);
      return c.json({message: "Signin required"});
    }
  } catch (err) {
    c.status(401);
    return c.json({message: "Invalid or expired token"});
  }
}