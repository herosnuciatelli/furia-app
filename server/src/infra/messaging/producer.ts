import { kafka } from "./kafka";

export const producer = kafka.producer({
    allowAutoTopicCreation: true
})

producer.connect().then(() => {
    console.log('[Fan Quiz App] Kafka producer connected')
})