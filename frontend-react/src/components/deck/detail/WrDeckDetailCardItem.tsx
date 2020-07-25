
import React, { useState } from "react";

import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CARD_DETAIL } from "../../../client-models";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";
import type { CardsOfDeck, CardsOfDeckVariables } from "./gqlTypes/CardsOfDeck";

import { wrStyled } from "../../../theme";
import { BorderlessButton } from "../../../ui/Button";
import Loading from "../../../ui-components/Loading";
import { List } from "../../../ui/List";


interface Props {
  deckId: string;
  card: CardDetail;
  readOnly?: boolean;
}

const WrDeckDetailCardItem = ({
  deckId,
  card,
  readOnly,
}: Props): JSX.Element => {
  return (
    <p>Card</p>
  );
};

export default WrDeckDetailCardItem;
