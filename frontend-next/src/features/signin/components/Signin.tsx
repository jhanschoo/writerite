import useFacebookSignin from '../hooks/useFacebookSignin';
import useGoogleSignin from '../hooks/useGoogleSignin';
import useDevelopmentSignin from '../hooks/useDevelopmentSignin';
import { Button, Group, Sx } from '@mantine/core';

interface Props {
  sx?: Sx;
}

export const Signin = ({ sx }: Props) => {
  const [, facebookSignin] = useFacebookSignin();
  const [, googleSignin] = useGoogleSignin();
  const [, developmentSignin] = useDevelopmentSignin();
  return (
    <Group>
      <Button onClick={googleSignin}>Sign in with Google</Button>
      <Button onClick={facebookSignin}>Sign in with Facebook</Button>
      {process.env.NODE_ENV === 'development' && (
        <Button onClick={developmentSignin}>Sign in in Development</Button>
      )}
    </Group>
  );
};
