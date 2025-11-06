import 'server-only';
import { User, Event, SwapRequest, EventStatus, SwapRequestStatus } from './definitions';
import { add, sub } from 'date-fns';

// In-memory store
let users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$uRPeR9FhG1GgYq8vM8gLgQ$9P5Y3jZ3sW7aF6g8aG7hJ5jH6kF4nDc2lB0dYdJ3gC4' }, // pass: password123
  { id: '2', name: 'Bob', email: 'bob@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$cE9rQ5nFhG2HjY9wN9hLhQ$wT6X4kK5oV8bH7i9bH8iK6kI7lG5oEd3mC1eZeK4hD5' }, // pass: password456
  { id: '3', name: 'Charlie', email: 'charlie@example.com', password: '$argon2id$v=19$m=65536,t=3,p=4$aB1sD4fGg3I jZ0xO0jM jQ$xU7Y5lJ6pW9cI8j0cI9jL7lJ8mH6pFe4nD2fXfL5iE6' }, // pass: password789
];

let events: Event[] = [
  { id: 'e1', title: 'Team Meeting', startTime: add(new Date(), { days: 1, hours: 2 }), endTime: add(new Date(), { days: 1, hours: 3 }), status: EventStatus.BUSY, ownerId: '1' },
  { id: 'e2', title: 'Focus Block', startTime: add(new Date(), { days: 1, hours: 5 }), endTime: add(new Date(), { days: 1, hours: 6 }), status: EventStatus.SWAPPABLE, ownerId: '1' },
  { id: 'e3', title: 'Dentist Appointment', startTime: add(new Date(), { days: 2, hours: 1 }), endTime: add(new Date(), { days: 2, hours: 2 }), status: EventStatus.BUSY, ownerId: '2' },
  { id: 'e4', title: 'Project Brainstorm', startTime: add(new Date(), { days: 2, hours: 6 }), endTime: add(new Date(), { days: 2, hours: 7 }), status: EventStatus.SWAPPABLE, ownerId: '2' },
  { id: 'e5', title: 'Gym Session', startTime: add(new Date(), { days: 3, hours: 0 }), endTime: add(new Date(), { days: 3, hours: 1 }), status: EventStatus.SWAPPABLE, ownerId: '3' },
  { id: 'e6', title: 'Client Call', startTime: add(new Date(), { days: 0, hours: 4 }), endTime: add(new Date(), { days: 0, hours: 5 }), status: EventStatus.SWAP_PENDING, ownerId: '1'},
  { id: 'e7', title: 'Code Review', startTime: add(new Date(), { days: 0, hours: 6 }), endTime: add(new Date(), { days: 0, hours: 7 }), status: EventStatus.SWAP_PENDING, ownerId: '3'}
];

let swapRequests: SwapRequest[] = [
    {
        id: 'sr1',
        requesterId: '3',
        responderId: '1',
        requesterSlotId: 'e7',
        responderSlotId: 'e6',
        status: SwapRequestStatus.PENDING,
        createdAt: new Date(),
        // Populated fields for convenience in functions
        requester: users.find(u => u.id === '3')!,
        responder: users.find(u => u.id === '1')!,
        requesterSlot: events.find(e => e.id === 'e7')!,
        responderSlot: events.find(e => e.id === 'e6')!,
    }
];

// Data Access Functions
export const findUserByEmail = (email: string) => users.find(u => u.email === email);
export const findUserById = (id: string) => users.find(u => u.id === id);
export const createUser = (user: User) => { users.push(user); return user; };

export const getEventsByOwnerId = (ownerId: string) => events.filter(e => e.ownerId === ownerId).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
export const findEventById = (id: string) => events.find(e => e.id === id);

export const createEvent = (event: Omit<Event, 'id' | 'status'>) => {
    const newEvent: Event = {
        id: `e${events.length + 1}`,
        ...event,
        status: EventStatus.BUSY,
    };
    events.push(newEvent);
    return newEvent;
};

export const updateEventStatus = (id: string, status: EventStatus) => {
    const event = findEventById(id);
    if (event) {
        event.status = status;
    }
    return event;
};

export const getSwappableEvents = (currentUserId: string) => {
    return events.filter(e => e.ownerId !== currentUserId && e.status === EventStatus.SWAPPABLE)
        .map(e => ({...e, owner: findUserById(e.ownerId)}))
        .sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
};

export const createSwapRequest = (requesterId: string, responderId: string, requesterSlotId: string, responderSlotId: string) => {
    const newSwap: Omit<SwapRequest, 'id' | 'createdAt' | 'requester' | 'responder' | 'requesterSlot' | 'responderSlot'> = {
        requesterId,
        responderId,
        requesterSlotId,
        responderSlotId,
        status: SwapRequestStatus.PENDING,
    };
    const newId = `sr${swapRequests.length + 1}`;
    const fullSwap: SwapRequest = {
        ...newSwap,
        id: newId,
        createdAt: new Date(),
        requester: findUserById(requesterId)!,
        responder: findUserById(responderId)!,
        requesterSlot: findEventById(requesterSlotId)!,
        responderSlot: findEventById(responderSlotId)!,
    }
    swapRequests.push(fullSwap);
    updateEventStatus(requesterSlotId, EventStatus.SWAP_PENDING);
    updateEventStatus(responderSlotId, EventStatus.SWAP_PENDING);
    return fullSwap;
};

export const findSwapRequestById = (id: string) => swapRequests.find(sr => sr.id === id);

export const respondToSwapRequest = (id: string, accepted: boolean) => {
    const swap = findSwapRequestById(id);
    if (!swap) return null;

    if (accepted) {
        swap.status = SwapRequestStatus.ACCEPTED;
        const requesterSlot = findEventById(swap.requesterSlotId);
        const responderSlot = findEventById(swap.responderSlotId);

        if (requesterSlot && responderSlot) {
            // Swap owners
            const tempOwnerId = requesterSlot.ownerId;
            requesterSlot.ownerId = responderSlot.ownerId;
            responderSlot.ownerId = tempOwnerId;

            // Set status back to BUSY
            requesterSlot.status = EventStatus.BUSY;
            responderSlot.status = EventStatus.BUSY;
        }
    } else {
        swap.status = SwapRequestStatus.REJECTED;
        updateEventStatus(swap.requesterSlotId, EventStatus.SWAPPABLE);
        updateEventStatus(swap.responderSlotId, EventStatus.SWAPPABLE);
    }
    return swap;
};

export const getIncomingRequests = (userId: string) => {
    return swapRequests.filter(sr => sr.responderId === userId && sr.status === SwapRequestStatus.PENDING).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getOutgoingRequests = (userId: string) => {
    return swapRequests.filter(sr => sr.requesterId === userId).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// This is a hack to re-populate the objects after a swap, since we are in memory
// In a real DB, you'd re-fetch with JOINS
export const repopulateSwapRequest = (swap: SwapRequest) => {
    swap.requester = findUserById(swap.requesterId)!;
    swap.responder = findUserById(swap.responderId)!;
    swap.requesterSlot = findEventById(swap.requesterSlotId)!;
    swap.responderSlot = findEventById(swap.responderSlotId)!;
    return swap;
}

export const getMySwappableSlots = (userId: string) => {
    return events.filter(e => e.ownerId === userId && e.status === EventStatus.SWAPPABLE).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
}
