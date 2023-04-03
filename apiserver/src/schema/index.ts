import { builder } from "../builder";
import "./Authentication";
import "./Card";
import "./Deck";
import "./Health";
import "./Message";
import "./Room";
import "./Session";
import "./User";
import "./relations";

export const schema = builder.toSchema();
