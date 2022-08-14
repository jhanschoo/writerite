import type { NextPage } from 'next';
import { useMutation } from 'urql';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

import { UserEditDocument } from '@generated/graphql';
import { useRouter } from 'next/router';
import { Button, Center, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

const FinalizeName: NextPage = () => {
  const form = useForm({
    initialValues: {
      name: '',
    },
  });
  const router = useRouter();
  const [, updateUserName] = useMutation(UserEditDocument);
  return (
    <Center sx={{ minHeight: '50vh' }}>
      <form onSubmit={form.onSubmit(async (values) => {
        const result = await updateUserName(values);
        if (result.data?.userEdit.name === values.name) {
          router.push('/app');
        }
      })}
      >
        <Stack>
          <Title order={1}>Let&rsquo;s finalize your account...</Title>
          <TextInput
            placeholder="Enter a username..."
            rightSection={<Button compact type="submit" variant="subtle"><PaperPlaneIcon /></Button>}
            description="Please enter a username that will be displayed publicly."
            label="Username"
            {...form.getInputProps('name')}
          />
        </Stack>
      </form>
    </Center>
  );
};

export default FinalizeName;
