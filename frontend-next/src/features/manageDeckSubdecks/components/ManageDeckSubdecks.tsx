import { FC, useState } from 'react';
import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import { ManageDeckSubdecksAddSubdeck } from './SubdecksAddSubdeck';
import { ManageDeckSubdecksBrowse } from './SubdecksBrowse';

enum Subpage {
  Browse = 'browse',
  Add = 'add',
}

// TODO: WIP
export const ManageDeckSubdecks: FC<ManageDeckProps> = ({ deck }) => {
  const [subpage, setSubpage] = useState<Subpage>(Subpage.Browse);
  switch (subpage) {
    case Subpage.Browse:
      return <ManageDeckSubdecksBrowse deck={deck} onAddSubdeck={() => setSubpage(Subpage.Add)} />;
    case Subpage.Add:
      return (
        <ManageDeckSubdecksAddSubdeck
          deck={deck}
          onFinishedAddingSubdecks={() => setSubpage(Subpage.Browse)}
        />
      );
  }
};
