import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from '../../env'
import { createFanRoute } from './routes/create-fan-route'
import { createQuizRoute } from './routes/create-quiz-route'
import { createRewardRoute } from './routes/create-reward-route'
import { getFanAuthRoute } from './routes/get-fan-auth'
import { purchaseRewardRoute } from './routes/purchase-reward-route'
import { sendPromptRoute } from './routes/send-prompt-route'
import { takeQuizRoute } from './routes/take-quiz-route'
import { viewGlobalRankingRoute } from './routes/view-global-ranking-route'
import { viewProfileRoute } from './routes/view-profile-route'
import { viewQuizHistoryRoute } from './routes/view-quiz-history-route'
import { viewTradeHistoryRoute } from './routes/view-trade-history-route'

const app = fastify()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FURIA - Chatbot CS:GO',
      version: '0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createFanRoute)
app.register(createRewardRoute)
app.register(purchaseRewardRoute)
app.register(viewProfileRoute)
app.register(viewTradeHistoryRoute)
app.register(viewGlobalRankingRoute)
app.register(createQuizRoute)
app.register(takeQuizRoute)
app.register(viewQuizHistoryRoute)
app.register(sendPromptRoute)
app.register(getFanAuthRoute)

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running!')
})
