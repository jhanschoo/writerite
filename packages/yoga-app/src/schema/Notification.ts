import { Notification as PNotification, Prisma } from 'database';

import { builder } from '../builder';
import { NOTIFICATION_UPDATES_BY_USERID_TOPIC } from '../service/notification';

export enum NotificationUpdateOperations {
  NOTIFICATION_CREATE = 'notificationCreate',
}

export interface NotificationUpdateShape {
  operation: NotificationUpdateOperations;
  value: PNotification;
}

export interface MessageUpdatePublishArgs {
  [NOTIFICATION_UPDATES_BY_USERID_TOPIC]: [
    userId: string,
    payload: NotificationUpdateShape
  ];
}

builder.enumType(NotificationUpdateOperations, {
  name: 'NotificationUpdateOperations',
  description:
    'Names identifying operations that trigger notification updates.',
});

export enum NotificationDataType {
  ROOM_INVITE = 'ROOM_INVITE',
}

builder.enumType(NotificationDataType, {
  name: 'NotificationDataType',
});

/**
 * Notifications have no access control, except for being user-contextualized.
 *
 * TODO: add parameter to retrieve notifications of another user, if admin
 */
export const Notification = builder.prismaNode('Notification', {
  authScopes: {
    authenticated: true,
  },
  id: { field: 'id' },
  fields: (t) => ({
    type: t.field({
      type: NotificationDataType,
      resolve: ({ type }) => type as NotificationDataType,
    }),
    data: t.field({
      type: 'JSONObject',
      nullable: true,
      resolve: ({ data }) => data as Prisma.JsonObject | null,
    }),
    isRead: t.exposeBoolean('isRead'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});

builder.queryFields((t) => ({
  notifications: t.prismaConnection({
    type: Notification,
    authScopes: {
      authenticated: true,
    },
    cursor: 'id',
    description: 'all notifications belonging to the current user',
    resolve: async (query, _root, _args, { prisma, sub }) => {
      const { bareId: userId } = sub!;
      const notifications = await prisma.notification.findMany({
        ...query,
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return notifications;
    },
  }),
}));

// TODO: mutations : create and mark read and subscription trigger for new notifications
