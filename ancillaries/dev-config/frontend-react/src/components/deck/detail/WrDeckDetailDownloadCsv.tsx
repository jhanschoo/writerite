import React from "react";
import { RawDraftContentState, convertFromRaw } from "draft-js";
import Papa from "papaparse";
import { saveAs } from "file-saver";

import { useSelector } from "react-redux";
import { WrState } from "src/store";

import type { CardScalars } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { BorderlessButton } from "src/ui";

const textFromRaw = (raw: GraphQLJSON): string => convertFromRaw(raw as unknown as RawDraftContentState).getPlainText(" ");

const PrimaryButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
flex-grow: 1;
display: flex;
margin: ${({ theme: { space } }) => ` 0 ${space[1]} ${space[2]} ${space[1]}`};
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :focus, :active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

interface Props {
  name: string;
}

const WrDeckDetailDownloadCsv = ({ name }: Props): JSX.Element => {
  const cards = useSelector<WrState, Map<string, CardScalars> | null>((state) => state.deckDetailCards?.cards ?? null);
  const handleDownloadCsv = () => {
    if (!cards) {
      return;
    }
    const rows: string[][] = [];
    // eslint-disable-next-line no-shadow
    cards.forEach(({ prompt, fullAnswer, answers }) => {
      rows.push([textFromRaw(prompt), textFromRaw(fullAnswer), ...answers]);
    });
    const csvString = Papa.unparse(rows);
    const blob = new Blob([csvString], { type: "text/csv" });
    saveAs(blob, `${name}.csv`);
  };
  return <PrimaryButton onClick={handleDownloadCsv} disabled={!cards}>Download CSV</PrimaryButton>;
};

export default WrDeckDetailDownloadCsv;
