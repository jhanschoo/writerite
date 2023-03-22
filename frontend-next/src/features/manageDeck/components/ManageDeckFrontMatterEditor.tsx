import { Input, Stack, TextInput } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';

export interface ManageDeckFrontMatterEditorProps
  extends Pick<ManageDeckProps['deck'], 'name' | 'description'> {
  setName: (name: string) => void;
  descriptionEditorElement: JSX.Element;
}

export const ManageDeckFrontMatterEditor = ({
  name,
  setName,
  descriptionEditorElement,
}: ManageDeckFrontMatterEditorProps) => {
  return (
    <Stack>
      <TextInput
        label="Title"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <Input.Wrapper label="Description">
        {descriptionEditorElement}
      </Input.Wrapper>
    </Stack>
  );
};
