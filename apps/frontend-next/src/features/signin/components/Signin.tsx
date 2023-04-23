import { useState } from 'react';
import { Button, Group, Sx, TextInput } from '@mantine/core';

import useDevelopmentSignin from '../hooks/useDevelopmentSignin';
import useFacebookSignin from '../hooks/useFacebookSignin';
import useGoogleSignin from '../hooks/useGoogleSignin';

interface Props {
  sx?: Sx;
}

export const Signin = ({ sx }: Props) => {
  const [, facebookSignin] = useFacebookSignin();
  const [, googleSignin] = useGoogleSignin();
  const [, developmentSignin] = useDevelopmentSignin();
  const [name, setName] = useState<string>('');
  return (
    <Group>
      <Button onClick={googleSignin}>Sign in with Google</Button>
      <Button onClick={facebookSignin}>Sign in with Facebook</Button>
      {process.env.NODE_ENV === 'development' && (
        <>
          <TextInput
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            label="dev. signin name"
          />
          <Button onClick={() => developmentSignin(name)}>
            Sign in in Development
          </Button>
        </>
      )}
    </Group>
  );
};
