import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routes/user'
import { generateRouter } from './routes/generate'

const app = new Hono()

app.use('/*', cors())

app.route('/thinky', generateRouter)
app.route('/thinky', userRouter)

export default app
