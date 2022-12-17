import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { Avatar, AvatarProps, Tooltip } from '@mantine/core';
import { FC } from 'react';
import { ProfileUser } from '../types';

interface Props {
  user: ProfileUser;
  avatarProps?: AvatarProps;
  showTooltip?: boolean;
}

export const ProfilePicture: FC<Props> = ({ avatarProps, user, showTooltip }) => {
  const avatarComponent = (
    <Avatar radius="xl" src={generatedAvatarUrl(user.id)} variant="light" {...avatarProps} />
  );
  if (showTooltip && user.name) {
    return <Tooltip label={user.name}>{avatarComponent}</Tooltip>;
  }
  return avatarComponent;
};
