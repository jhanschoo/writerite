import { createClient } from './redisClient';
import { SERVE_ROOM_CHANNEL, serveRoom } from './serveRoom';

const subscriberClient = createClient();

subscriberClient.subscribe(SERVE_ROOM_CHANNEL);

subscriberClient.on('message', (channel: string, roomId: string) => {
  switch (channel) {
    case SERVE_ROOM_CHANNEL:
      serveRoom(roomId);
      break;
  }
});
