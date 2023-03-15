export async function* trimSubscriptionHeartbeats(stream: ReadableStream<Uint8Array>) {
  for await (const chunk of stream) {
    const events = chunk.toString().split('\n').filter((line) => line.startsWith('data:'));
    for (const event of events) {
      yield event.slice(6);
    }
  }
}
