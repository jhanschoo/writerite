import { formatISO, parseISO } from 'date-fns';
import { DecksQuery } from "@generated/graphql";
import { Divider, Paper, Stack, Typography, useTheme } from "@mui/material";
import { FC, MouseEvent } from "react";
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import { useRouter } from 'next/router';


interface ItemProps {
  deck: DecksQuery["decks"][number];
}

export const DecksListItem: FC<ItemProps> = ({ deck }: ItemProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { name, subdecks, cardsDirect, editedAt } = deck;
  const { setMotionProps } = useMotionContext();
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    setMotionProps(motionThemes.forward);
    router.push(`/app/deck/${deck.id}`);
  }
  const title = deck.name ? <Typography variant="h5" sx={{flexGrow: 1}}>{name}</Typography> : <Typography variant="h5" sx={{ fontStyle: "italic", color: theme.palette.text.secondary, flexGrow: 1 }}>Untitled</Typography>;
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: "date" });
  return <Paper sx={{ padding: 2, cursor: "pointer" }} onClick={handleClick}>
    <Stack direction="row"  divider={<Divider orientation="vertical" flexItem />} spacing={2} alignItems="center">
      {title}
      <Typography textAlign="center"><strong>{subdecks.length}</strong><br />subdecks</Typography>
      <Typography textAlign="center"><strong>{cardsDirect.length}</strong><br />cards</Typography>
      <Typography textAlign="center"><strong>{editedAtDisplay}</strong><br />last edited</Typography>
    </Stack>
  </Paper>;
}

interface Props {
  decks?: DecksQuery["decks"];
}

export const DecksList: FC<Props> = ({ decks }: Props) => {
  const decksList = decks?.map((deck) => <DecksListItem deck={deck} key={deck.id} />);
  return <Stack>
    {decksList}
  </Stack>;
}
