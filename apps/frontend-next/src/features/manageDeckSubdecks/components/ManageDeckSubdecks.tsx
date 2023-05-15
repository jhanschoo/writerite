import Link from 'next/link';
import { useRouter } from 'next/router';
import { FragmentType, useFragment } from '@generated/gql';
import {
  DECK_DETAIL_SUBDECK_LINK_PATH,
  DECK_DETAIL_SUBDECK_PATH,
} from '@/paths';

import { ManageDeckSubdecksFragment } from '../fragments/ManageDeckSubdecksFragment';
import { ManageDeckSubdecksLinkSubdeck } from './SubdecksLinkSubdeck';
import { ManageDeckSubdecksBrowse } from './SubdecksBrowse';

enum Subpage {
  Browse = 'browse',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  Link = 'link',
  Import = 'import',
}

interface Props {
  deck: FragmentType<typeof ManageDeckSubdecksFragment>;
  path?: string[];
}

export const ManageDeckSubdecks = ({ deck, path }: Props) => {
  const { id } = useFragment(ManageDeckSubdecksFragment, deck);
  const router = useRouter();
  const [subpath] = path ?? [];
  const subpage = (subpath || 'browse') as Subpage;
  switch (subpage) {
    case Subpage.Link:
      return (
        <ManageDeckSubdecksLinkSubdeck
          deck={deck}
          onFinishedLinkingSubdecks={() =>
            router.replace(DECK_DETAIL_SUBDECK_PATH(id))
          }
        />
      );
    case Subpage.Import:
      return (
        <p>
          Not implemented yet:{' '}
          <Link href={DECK_DETAIL_SUBDECK_LINK_PATH(id)}>
            back to add decks
          </Link>
        </p>
      );
    case Subpage.Browse:
    default:
      return (
        <ManageDeckSubdecksBrowse
          deck={deck}
          onAddSubdeck={() => router.replace(DECK_DETAIL_SUBDECK_LINK_PATH(id))}
        />
      );
  }
};
