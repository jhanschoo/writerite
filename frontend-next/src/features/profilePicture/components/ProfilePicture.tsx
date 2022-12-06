import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { Avatar, Tooltip } from '@mantine/core';
import { FC } from 'react';
import { ProfileUser } from '../types';

interface Props {
  user: ProfileUser;
  showTooltip?: boolean;
}

export const ProfilePicture: FC<Props> = ({ user, showTooltip }) => {
  const avatarComponent = <Avatar radius="xl" src={generatedAvatarUrl(user.id)} variant="light" />;
  if (showTooltip && user.name) {
    return <Tooltip label={user.name}>{avatarComponent}</Tooltip>;
  }
  return avatarComponent;
};
