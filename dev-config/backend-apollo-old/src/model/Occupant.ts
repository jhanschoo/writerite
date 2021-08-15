import type { Occupant } from "@prisma/client";
import type { RoomSS } from "./Room";
import type { UserSS } from "./User";

// OccupantStoredScalars
export interface OccupantSS extends Partial<Occupant> {
  id: string;
  roomId: string;
  occupantId: string;

  createdAt: Date;
  updatedAt: Date;

  room?: RoomSS | null;
  occupant?: UserSS | null;
}
