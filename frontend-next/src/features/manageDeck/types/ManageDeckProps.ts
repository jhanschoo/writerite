import { DeckQuery } from "@generated/graphql";

export interface ManageDeckProps {
  deck: DeckQuery["deck"] // TODO: decouple interface from GraphQL return shape definition
}
