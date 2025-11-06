# SlotSwapper: Peer-to-Peer Time-Slot Scheduling

SlotSwapper is a Next.js app that lets users trade time slots with each other. This project demonstrates a modern web app using the Next.js App Router, Server Components, and Server Actions.

## Features

- **User Accounts**: Sign up and log in.
- **Calendar**: Manage your events and mark them as "swappable".
- **Marketplace**: Find swappable time slots from other users.
- **Swapping**: Request to swap one of your slots for someone else's.

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI**: React with ShadCN/UI components
- **Styling**: Tailwind CSS
- **Data**: Simple in-memory JavaScript array (no database required).
- **Authentication**: Basic cookie-based sessions for demonstration.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the App
```bash
npm run dev
```

### 3. Open in Browser
Navigate to [http://localhost:9002](http://localhost:9002).

You can use these test accounts:
- `alice@example.com` (pw: `password123`)
- `bob@example.com` (pw: `password456`)

---

## Server Actions (API)

The app uses Next.js Server Actions instead of a traditional API.

| Action                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `login` / `signup`     | Authenticates or creates a user.             |
| `createEvent`          | Adds a new event to a user's calendar.       |
| `updateEventStatus`    | Marks an event as `SWAPPABLE` or `BUSY`.     |
| `createSwapRequest`    | Initiates a swap between two users.          |
| `respondToSwapRequest` | Accepts or rejects an incoming swap request. |

---

## Assumptions & Challenges

- **Prototype, Not Production**: The app is a functional demo. The data store and auth are simplified for this purpose.
- **Server-Side Logic**: Managing UI updates after server actions was a key challenge, solved using Next.js's `revalidatePath`.
