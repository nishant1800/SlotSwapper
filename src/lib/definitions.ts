export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client
};

export enum EventStatus {
  BUSY = 'BUSY',
  SWAPPABLE = 'SWAPPABLE',
  SWAP_PENDING = 'SWAP_PENDING',
}

export type Event = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
  ownerId: string;
  owner?: User; // populated for display
};

export enum SwapRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export type SwapRequest = {
  id: string;
  requesterId: string;
  requester: User;
  responderId: string;
  responder: User;
  requesterSlotId: string;
  requesterSlot: Event;
  responderSlotId: string;
  responderSlot: Event;
  status: SwapRequestStatus;
  createdAt: Date;
};
