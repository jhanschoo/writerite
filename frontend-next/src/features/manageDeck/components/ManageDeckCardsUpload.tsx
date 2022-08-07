import { FC, useState } from 'react';
import { createStyles, Stack, Stepper } from '@mantine/core';

import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckCardsUploadImport } from './ManageDeckCardsUploadImport';
import { ManageDeckCardsUploadInstructions } from './ManageDeckCardsUploadInstructions';

const useStyles = createStyles((theme) => ({
  modal: {
    minWidth: '50vw',
    minHeight: '50vh',
    // display: 'flex',
    // flexDirection: 'column',
  },
  body: {
    flexGrow: 1,
  }
}));

export const ManageDeckCardsUpload: FC<ManageDeckProps> = ({ deck }) => {
  const [active, setActive] = useState(1);
  return (
    <Stack>
      <Stepper active={active} onStepClick={setActive} breakpoint="md" p="md">
        <Stepper.Step label="Prepare" description="Format a .csv file">
          <ManageDeckCardsUploadInstructions />
        </Stepper.Step>
        <Stepper.Step label="Import" description="Drop your file">
          <ManageDeckCardsUploadImport deck={deck} />
        </Stepper.Step>
        <Stepper.Step label="Review" description="Confirm the cards">
          Bah
        </Stepper.Step>
      </Stepper>
    </Stack>
  );
};
