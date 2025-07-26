import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
    clientId: 'fan-quiz-app',
    brokers: ['localhost:9092']
})