import { DECK_DETAIL_SUBDECK_LINK_PATH, DECK_DETAIL_SUBDECK_PATH } from '@/paths';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import { ManageDeckSubdecksLinkSubdeck } from './SubdecksAddSubdeck';
import { ManageDeckSubdecksBrowse } from './SubdecksBrowse';

enum Subpage {
  Browse = 'browse',
  Link = 'link',
  Import = 'import',
}

// TODO: WIP
export const ManageDeckSubdecks = ({ deck, path }: ManageDeckProps) => {
  const router = useRouter();
  const [subpath] = path ?? [];
  const subpage = (subpath || 'browse') as Subpage;
  switch (subpage) {
    case Subpage.Link:
      return (
        <ManageDeckSubdecksLinkSubdeck
          deck={deck}
          onFinishedLinkingSubdecks={() => router.replace(DECK_DETAIL_SUBDECK_PATH(deck.id))}
        />
      );
    case Subpage.Import:
      return (
        <p>
          Not implemented yet:{' '}
          <Link href={DECK_DETAIL_SUBDECK_LINK_PATH(deck.id)}>back to add decks</Link>
        </p>
      );
    case Subpage.Browse:
      return (
        <ManageDeckSubdecksBrowse
          deck={deck}
          onAddSubdeck={() => router.replace(DECK_DETAIL_SUBDECK_LINK_PATH(deck.id))}
        />
      );
  }
};
