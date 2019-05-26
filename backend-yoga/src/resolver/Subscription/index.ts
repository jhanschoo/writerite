import { IResolverObject } from 'graphql-tools';
import { IContext } from '../../types';

import { rwDeckSubscription } from './RwDeck.subscription';
import { rwCardSubscription } from './RwCard.subscription';
import { rwRoomSubscription } from './RwRoom.subscription';
import { rwRoomMessageSubscription } from './RwRoomMessage.subscription';

// tslint:disable-next-line: variable-name
const Subscription: IResolverObject<any, IContext, any> = {
  ...rwDeckSubscription,
  ...rwCardSubscription,
  ...rwRoomSubscription,
  ...rwRoomMessageSubscription,
};

export default Subscription;
