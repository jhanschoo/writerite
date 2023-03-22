import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { Avatar, AvatarProps, Tooltip } from '@mantine/core';
import { ProfileUser } from '../types';

interface Props {
  user: ProfileUser;
  avatarProps?: AvatarProps;
  showTooltip?: boolean;
}

export const ProfilePicture = ({ avatarProps, user, showTooltip }: Props) => {
  const avatarComponent = (
    <Avatar radius="xl" src={generatedAvatarUrl(user.id)} variant="light" {...avatarProps} />
  );
  if (showTooltip && user.name) {
    return <Tooltip label={user.name}>{avatarComponent}</Tooltip>;
  }
  return avatarComponent;
};
