import { FC, useState } from 'react';
import { Stack, Stepper } from '@mantine/core';

import { ManageDeckProps } from '@/features/manageDeck';
import { ManageDeckCardsUploadImport } from './CardsUploadImport';
import { ManageDeckCardsUploadInstructions } from './CardsUploadInstructions';
import type { ImportCardsData } from '../types';
import { ManageDeckCardsUploadReview } from './CardsUploadReview';

interface Props extends ManageDeckProps {
  onUploadCompleted: () => unknown;
}

type UploadState = { step: 0 } | { step: 1 } | ({ step: 2 } & ImportCardsData);

export const ManageDeckCardsUpload: FC<Props> = ({ deck, onUploadCompleted }) => {
  const [{ step, ...data }, setUploadState] = useState<UploadState>({ step: 0 });
  return (
    <Stack>
      <Stepper active={step} breakpoint="md" p="md">
        <Stepper.Step label="Prepare" description="Format a .csv file">
          <ManageDeckCardsUploadInstructions onNextStep={() => setUploadState({ step: 1 })} />
        </Stepper.Step>
        <Stepper.Step label="Import" description="Choose the file">
          <ManageDeckCardsUploadImport
            onPreviousStep={() => setUploadState({ step: 0 })}
            onSuccessfulImport={(cards) => setUploadState({ step: 2, cards })}
          />
        </Stepper.Step>
        <Stepper.Step label="Review" description="Confirm the cards">
          <ManageDeckCardsUploadReview
            deck={deck}
            {...(data as ImportCardsData)}
            onPreviousStep={() => setUploadState({ step: 1 })}
            onUploadCompleted={onUploadCompleted}
          />
        </Stepper.Step>
      </Stepper>
    </Stack>
  );
};
