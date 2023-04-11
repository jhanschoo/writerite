import { builder } from "../builder";
import "./inputs";
import "./Authentication";
import "./Card";
import "./Deck";
import "./Health";
import "./Message";
import "./Room";
import "./Round";
import "./Session";
import "./User";
import "./relations";

export const schema = builder.toSchema();
