import { FC } from 'react';
import { Stack } from '@mantine/core';
import { UserDecksSummary } from '@/features/dashboard/components/UserDecksSummary';

export const Dashboard: FC = () => <Stack p="md"><UserDecksSummary /></Stack>;
