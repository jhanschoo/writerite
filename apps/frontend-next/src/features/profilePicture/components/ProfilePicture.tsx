import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { Avatar, AvatarProps, Tooltip } from '@mantine/core';

interface Props {
  user: { id: string; name: string };
  avatarProps?: AvatarProps;
  showTooltip?: boolean;
}

export const ProfilePicture = ({ avatarProps, user: { id, name }, showTooltip }: Props) => {
  const avatarComponent = (
    <Avatar radius="xl" src={generatedAvatarUrl(id)} variant="light" {...avatarProps} />
  );
  if (showTooltip && name) {
    return <Tooltip label={name}>{avatarComponent}</Tooltip>;
  }
  return avatarComponent;
};
