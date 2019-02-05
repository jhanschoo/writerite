// tslint:disable-next-line:no-submodule-imports
import { rwDeckSubscription } from './RwDeck.subscription';
import { rwCardSubscription } from './RwCard.subscription';
import { rwRoomSubscription } from './RwRoom.subscription';
import { rwRoomMessageSubscription } from './RwRoomMessage.subscription';

// tslint:disable-next-line: variable-name
const Subscription = {
  ...rwDeckSubscription,
  ...rwCardSubscription,
  ...rwRoomSubscription,
  ...rwRoomMessageSubscription,
};

export default Subscription;
