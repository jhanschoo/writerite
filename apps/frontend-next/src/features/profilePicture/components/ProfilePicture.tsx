import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { Avatar, AvatarProps, Tooltip } from '@mantine/core';

interface Props {
  user: { bareId: string; name: string };
  avatarProps?: AvatarProps;
  showTooltip?: boolean;
}

export const ProfilePicture = ({
  avatarProps,
  user: { bareId, name },
  showTooltip,
}: Props) => {
  const avatarComponent = (
    <Avatar
      radius="xl"
      src={generatedAvatarUrl(bareId)}
      variant="light"
      {...avatarProps}
    />
  );
  if (showTooltip && name) {
    return <Tooltip label={name}>{avatarComponent}</Tooltip>;
  }
  return avatarComponent;
};
