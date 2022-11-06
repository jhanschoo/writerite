import {
  useState,
  FC,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import { DeckCreateDocument, DecksQueryScope, RoomBySlugDocument } from '@generated/graphql';
import { useMutation, useQuery } from 'urql';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import { useDebounce } from 'use-debounce';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  createStyles,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

const useStyles = createStyles((theme) => {
  const { background: backgroundColor } = theme.fn.variant({ variant: 'default', color: 'gray' });
  // https://github.com/mantinedev/mantine/blob/c7d080c2133b0196e3a8382ec6134838632c8f9a/src/mantine-core/src/Tabs/Tab/Tab.styles.ts#L49
  const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  const { breakpoints } = theme;
  return {
    inputPanel: {
      backgroundColor,
      borderTop: `1px solid ${borderColor}`,
      width: '100%',
    },
  };
});

interface Props {
  slug: string;
}

export const ManageRoom: FC<Props> = ({ slug }) => {
  const { classes } = useStyles();
  const [{ data }, refetchRoom] = useQuery({
    query: RoomBySlugDocument,
    variables: {
      slug
    },
  });
  return (
    <Stack sx={{ height: '100%' }} align="center">
    <Stack
      mx="md"
      sx={({ breakpoints }) => ({
        maxWidth: `${breakpoints.lg}px`,
        minHeight: 0,
        flexShrink: 1,
        overflowY: 'scroll',
      })}
    >
      <Box sx={{ height: '100vh' }} />
      <Title>Room {slug}</Title>
      <Divider
        label="This is the start of conversation in this room"
        variant="dashed"
        mr="md"
      />
      <Text>
        The standard Lorem Ipsum passage, used since the 1500s "Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum."
      </Text>
      <Text>
        {JSON.stringify(data)}
      </Text>
    </Stack>
    <Group p="md" className={classes.inputPanel} position="center">
      <TextInput
        rightSection={
          <ActionIcon type="submit" variant="subtle" color="dark" title="Save">
            <PaperPlaneIcon />
          </ActionIcon>
        }
        variant="filled"
        sx={{
          minWidth: '33vw',
        }}
      />
    </Group>
  </Stack>
  );
};
