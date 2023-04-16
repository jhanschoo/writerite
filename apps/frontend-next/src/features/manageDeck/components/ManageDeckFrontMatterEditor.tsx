import { Input, Stack, TextInput } from '@mantine/core';

export interface Props {
  name: string;
  setName: (name: string) => void;
  descriptionEditorElement: JSX.Element;
}

export const ManageDeckFrontMatterEditor = ({
  name,
  setName,
  descriptionEditorElement,
}: Props) => {
  return (
    <Stack>
      <TextInput
        label="Title"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <Input.Wrapper label="Description">{descriptionEditorElement}</Input.Wrapper>
    </Stack>
  );
};
