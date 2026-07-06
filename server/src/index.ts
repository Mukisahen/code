import { createApp } from './app.js'
import { env } from './env.js'

const app = createApp()

app.listen(env.port, () => {
  console.log(`Farm Bhade API listening on port ${env.port}`)
})
