import { builder } from "../../builder";

export enum DecksQueryScope {
  OWNED = "OWNED",
  VISIBLE = "VISIBLE",
}

builder.enumType(DecksQueryScope, {
  name: "DecksQueryScope",
  description: "ownership type of of decks returned",
});
