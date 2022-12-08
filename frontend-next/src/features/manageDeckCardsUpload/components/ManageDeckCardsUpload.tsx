import { FC, useState } from 'react';
import { Stack, Stepper } from '@mantine/core';

import { ManageDeckProps } from '@/features/manageDeck';
import { Import } from './Import';
import { Instructions } from './Instructions';
import type { ImportCardsData } from '../types';
import { Review } from './Review';

interface Props extends ManageDeckProps {
  onUploadEnded(): unknown;
}

type UploadState = { step: 0 } | { step: 1 } | ({ step: 2 } & ImportCardsData);

export const ManageDeckCardsUpload: FC<Props> = ({ deck, onUploadEnded }) => {
  const [{ step, ...data }, setUploadState] = useState<UploadState>({ step: 0 });
  return (
    <Stack>
      <Stepper active={step} breakpoint="md" p="md">
        <Stepper.Step label="Prepare" description="Prepare the .csv file">
          <Instructions onNextStep={() => setUploadState({ step: 1 })} onCancel={onUploadEnded} />
        </Stepper.Step>
        <Stepper.Step label="Import" description="Import into WriteRite">
          <Import
            onPreviousStep={() => setUploadState({ step: 0 })}
            onCancel={onUploadEnded}
            onSuccessfulImport={(cards) => setUploadState({ step: 2, cards })}
          />
        </Stepper.Step>
        <Stepper.Step label="Review" description="Review & upload cards">
          <Review
            deck={deck}
            {...(data as ImportCardsData)}
            onPreviousStep={() => setUploadState({ step: 1 })}
            onCancel={onUploadEnded}
            onUploadCompleted={onUploadEnded}
          />
        </Stepper.Step>
      </Stepper>
    </Stack>
  );
};
