'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { createSession, deleteSession, getSession, verify } from './auth';
import { 
  createEvent as dbCreateEvent,
  createUser, 
  findUserByEmail, 
  updateEventStatus as dbUpdateEventStatus,
  findEventById,
  createSwapRequest as dbCreateSwapRequest,
  findSwapRequestById,
  respondToSwapRequest as dbRespondToSwapRequest
} from './data';
import { EventStatus } from './definitions';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Invalid email or password.' };
  }

  const { email, password } = validatedFields.data;
  const user = findUserByEmail(email);

  if (!user || !(await verify(password, user))) {
    return { error: 'Invalid email or password.' };
  }
  
  await createSession(user.id);
  redirect('/dashboard');
}

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signup(prevState: any, formData: FormData) {
    const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: 'Invalid fields. Please check your input.' };
    }

    const { name, email, password } = validatedFields.data;

    if (findUserByEmail(email)) {
        return { error: 'User with this email already exists.' };
    }

    const newUser = createUser({
        id: `u${Date.now()}`,
        name,
        email,
        password, // In a real app, you'd hash this
    });

    await createSession(newUser.id);
    redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

const eventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
}).refine(data => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
});

export async function createEvent(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const validatedFields = eventSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: 'Invalid event data.' };
    }
    
    dbCreateEvent({ ...validatedFields.data, ownerId: session.user.id });
    revalidatePath('/dashboard');
    return { success: 'Event created successfully.' };
}

export async function updateEventStatus(eventId: string, status: EventStatus) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const event = findEventById(eventId);
    if (!event || event.ownerId !== session.user.id) {
        return { error: 'Event not found or you do not own this event.' };
    }

    dbUpdateEventStatus(eventId, status);
    revalidatePath('/dashboard');
    revalidatePath('/marketplace');
    return { success: 'Event status updated.' };
}


export async function createSwapRequest(mySlotId: string, theirSlotId: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const mySlot = findEventById(mySlotId);
    const theirSlot = findEventById(theirSlotId);

    if (!mySlot || !theirSlot) return { error: 'One or both slots not found.' };

    if (mySlot.ownerId !== session.user.id) return { error: 'You do not own the slot you are offering.' };

    if (mySlot.status !== EventStatus.SWAPPABLE || theirSlot.status !== EventStatus.SWAPPABLE) {
        return { error: 'Both slots must be swappable.' };
    }

    dbCreateSwapRequest(session.user.id, theirSlot.ownerId, mySlotId, theirSlotId);

    revalidatePath('/dashboard');
    revalidatePath('/marketplace');
    revalidatePath('/requests');

    return { success: 'Swap request sent!' };
}


export async function respondToSwapRequest(requestId: string, accepted: boolean) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    const request = findSwapRequestById(requestId);
    if (!request || request.responderId !== session.user.id) {
        return { error: 'Request not found or you are not the recipient.' };
    }

    dbRespondToSwapRequest(requestId, accepted);

    revalidatePath('/dashboard');
    revalidatePath('/marketplace');
    revalidatePath('/requests');

    return { success: `Request ${accepted ? 'accepted' : 'rejected'}.` };
}
