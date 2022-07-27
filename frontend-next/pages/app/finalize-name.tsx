import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useMutation } from 'urql';
import { PaperPlaneIcon } from '@modulz/radix-icons';

import { UserEditDocument } from '@generated/graphql';
import { useMotionContext } from '@hooks/useMotionContext';
import { useRouter } from 'next/router';
import { Button, Center, InputWrapper, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/hooks';

const FinalizeName: NextPage = () => {
  const form = useForm({
    initialValues: {
      name: '',
    },
  });
  const router = useRouter();
  const { motionProps } = useMotionContext();
  const [, updateUserName] = useMutation(UserEditDocument);
  return (
    <motion.div {...motionProps}>
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
            <InputWrapper
              id="input-username"
              required
              label="Username"
              description="Please enter a username that will be displayed publicly."
            >
              <TextInput
                id="input-username"
                placeholder="Enter a username..."
                rightSection={<Button compact type="submit" variant="subtle"><PaperPlaneIcon /></Button>}
                {...form.getInputProps('name')}
              />
            </InputWrapper>
          </Stack>
        </form>
      </Center>
    </motion.div>
  );
};

export default FinalizeName;
