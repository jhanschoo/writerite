import { createClient } from './redisClient';
import { SERVE_ROOM_CHANNEL, serveRoom } from './serveRoom';
import { IRoomConfig } from './models/WrRoomStub';

const subscriberClient = createClient();

subscriberClient.subscribe(SERVE_ROOM_CHANNEL);

subscriberClient.on('message', (channel: string, message: string) => {
  try {
    switch (channel) {
      case SERVE_ROOM_CHANNEL:
        const separatorIndex = message.indexOf(':');
        if (separatorIndex === -1) {
          throw new Error('separator not found');
        }
        const roomId = message.slice(0, separatorIndex);
        const config = message.slice(separatorIndex + 1);
        const configObj: IRoomConfig = JSON.parse(config);
        serveRoom(roomId, configObj);
        break;
    }
  } catch (e) {
    return;
  }
});
