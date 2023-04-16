import { createStyles, Group, Stack, Tabs } from '@mantine/core';
import { ManageDeckCards } from '../../manageDeckCards/components/ManageDeckCards';
import { ManageDeckSubdecks } from '../../manageDeckSubdecks/components/ManageDeckSubdecks';
import { ManageDeckCardsUpload } from '@/features/manageDeckCardsUpload';
import { useRouter } from 'next/router';
import { DECK_DETAIL_PATH, DECK_DETAIL_IMPORT_PATH, DECK_DETAIL_SUBDECK_PATH } from '@/paths';
import { FragmentType, graphql, useFragment } from '@generated/gql';

const ManageDeckContentFragment = graphql(/* GraphQL */ `
  fragment ManageDeckContent on Deck {
    id
    editedAt
    cardsDirectCount
    subdecksCount
    ...ManageDeckCardsUploadReview
    ...ManageDeckSubdecks
    ...ManageDeckCards
  }
`);

const useStyles = createStyles((theme) => {
  const { background: backgroundColor } = theme.fn.variant({ variant: 'default', color: 'gray' });
  // https://github.com/mantinedev/mantine/blob/c7d080c2133b0196e3a8382ec6134838632c8f9a/src/mantine-core/src/Tabs/Tab/Tab.styles.ts#L49
  const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  const { breakpoints, spacing } = theme;
  return {
    root: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
    },
    tab: {
      '&[data-active]': {
        backgroundColor,
      },
      '&[data-active]::before': {
        backgroundColor,
      },
    },
    tabsListWrapper: {
      borderBottom: `1px solid ${borderColor}`,
    },
    tabsList: {
      maxWidth: `${breakpoints.lg}`,
      width: `calc(100% - ${spacing.md} * 4)`,
      margin: '0 auto',
      border: '0',
    },
    panelWrapper: {
      backgroundColor,
      flexGrow: 1,
      alignItems: 'center',
    },
    panel: {
      maxWidth: breakpoints.lg,
      flexGrow: 1,
      padding: spacing.md,
      width: '100%',
    },
  };
});

enum Subpage {
  Card = 'card',
  Subdeck = 'subdeck',
  Import = 'import',
}

interface Props {
  deck: FragmentType<typeof ManageDeckContentFragment>;
  path?: string[];
}

export const ManageDeckContent = ({ deck, path }: Props) => {
  const deckFragment = useFragment(ManageDeckContentFragment, deck);
  const { id, cardsDirectCount, subdecksCount } = deckFragment;
  const { classes } = useStyles();
  const router = useRouter();
  const [subpath, ...rest] = path ?? [];
  const subpage = (subpath || 'card') as Subpage;
  const handleTabChange = (tabValue: Subpage | null) => {
    switch (tabValue) {
      case Subpage.Card:
        router.replace(DECK_DETAIL_PATH(id));
        break;
      case Subpage.Subdeck:
        router.replace(DECK_DETAIL_SUBDECK_PATH(id));
        break;
      case Subpage.Import:
        router.replace(DECK_DETAIL_IMPORT_PATH(id));
        break;
    }
  };
  return (
    <Tabs variant="outline" value={subpage} onTabChange={handleTabChange} classNames={classes}>
      <Group className={classes.tabsListWrapper}>
        <Tabs.List>
          <Tabs.Tab value={Subpage.Card}>{cardsDirectCount} Cards</Tabs.Tab>
          <Tabs.Tab value={Subpage.Subdeck}>{subdecksCount} Subdecks</Tabs.Tab>
          <Tabs.Tab value={Subpage.Import}>Import</Tabs.Tab>
        </Tabs.List>
      </Group>
      <Stack className={classes.panelWrapper}>
        <Tabs.Panel value={Subpage.Card}>
          <ManageDeckCards
            deck={deckFragment}
            startUpload={() => router.replace(DECK_DETAIL_IMPORT_PATH(id))}
          />
        </Tabs.Panel>

        <Tabs.Panel value={Subpage.Subdeck}>
          <ManageDeckSubdecks deck={deckFragment} path={rest} />
        </Tabs.Panel>

        <Tabs.Panel value={Subpage.Import}>
          <ManageDeckCardsUpload
            deck={deckFragment}
            onUploadEnded={() => router.replace(DECK_DETAIL_PATH(id))}
          />
        </Tabs.Panel>
      </Stack>
    </Tabs>
  );
};
