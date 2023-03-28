import { ToolbaredRichTextEditor, useContentEditor } from '@/components/editor';
import { UserProfile } from '@/components/user';
import { UserEditDocument } from '@generated/graphql';
import { Box, Button, Card, Flex, Input, LoadingOverlay, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { useMutation } from 'urql';
import { ManagePersonalProps } from '../types';

export const PersonalFriends = ({ user }: ManagePersonalProps) => {
  return (
    <Card shadow="xl" radius="lg" p="md">
      <Box>
        <Title order={2} mb="md">
          Friends
        </Title>
      </Box>
    </Card>
  );
};
