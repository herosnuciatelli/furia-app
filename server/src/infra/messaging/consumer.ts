
import { kafka } from "./kafka"

interface RankingNewViewerMessage {
  viewers: string[]
}

async function main() {
  const consumer = kafka.consumer({ groupId: 'ranking-group', allowAutoTopicCreation: true })

  await consumer.connect()
  await consumer.subscribe({ topic: 'ranking.views' })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const rankingJSON = message.value?.toString();

      if (!rankingJSON) {
        return;
      }

      const ranking: RankingNewViewerMessage = JSON.parse(rankingJSON);

      console.log(`[Fan Quiz App] Users that were viewed: ${ranking.viewers}`)
    },
  })
}

main().then(() => {
  console.log('[Fan Quiz App] Listening to Kafka messages')
})