import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { UserProfileFragment } from '@generated/graphql';
import { Avatar, AvatarProps, Tooltip } from '@mantine/core';

interface Props {
  user: UserProfileFragment;
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
