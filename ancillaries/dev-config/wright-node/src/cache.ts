/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InMemoryCache, PossibleTypesMap } from "@apollo/client";
import possibleTypes from "./possibleTypes.json";

export const cache = new InMemoryCache({
  possibleTypes: possibleTypes as PossibleTypesMap,
  typePolicies: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Deck: {
      fields: {
        subdecks: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Query: {
      fields: {
        cardsOfDeck: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
        decks: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UserDeckRecord: {
      keyFields: ["userId", "deckId"],
    },
  },
});
