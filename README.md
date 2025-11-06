# SlotSwapper: Peer-to-Peer Time-Slot Scheduling

This repository contains the source code for SlotSwapper, a web application built with Next.js that allows users to trade time slots with each other. It's designed as a demonstration of modern web development practices using the Next.js App Router, React Server Components, and Server Actions.

## Project Overview

SlotSwapper is a peer-to-peer time-slot scheduling app. Users can add their events/commitments to a personal calendar, mark certain slots as "swappable," and then browse a marketplace of other users' swappable slots. They can request to swap one of their slots for someone else's, and the other user can accept or reject the request.

### Key Features

- **Authentication**: User sign-up and login.
- **Dashboard**: View and manage your personal event schedule.
- **Event Creation**: Add new time slots to your calendar.
- **Swapping**: Mark your own events as swappable or make them busy again.
- **Marketplace**: Browse all available slots from other users that are marked as swappable.
- **Requests**: Initiate a swap request by offering one of your slots for another user's slot.
- **Request Management**: View and respond to incoming swap requests, and see the status of your outgoing requests.

### Design & Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [ShadCN/UI](https://ui.shadcn.com/) for pre-built, accessible, and customizable components.
- **State Management**: Primarily React Server Components for data fetching and Server Actions with `useActionState` for form handling.
- **Data Persistence**: A simple in-memory JavaScript array (`src/lib/data.js`) is used to simulate a database. This was a deliberate choice to keep the project simple and self-contained, without requiring any database setup.
- **Authentication**: A basic, cookie-based session management system (`src/lib/auth.js`) is implemented for demonstration purposes. It is not intended for production use.

---

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/en) (Version 18.x or later recommended)
- [npm](https://www.npmjs.com/) (or another package manager like yarn or pnpm)

### Setup and Installation

1.  **Install Dependencies**:
    Navigate to the project's root directory and run the following command to install all the necessary packages.

    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    Once the installation is complete, you can start the Next.js development server.

    ```bash
    npm run dev
    ```

3.  **Access the Application**:
    Open your web browser and navigate to the following URL:

    [http://localhost:9002](http://localhost:9002)

    You should see the SlotSwapper landing page. You can create an account or use one of the pre-seeded user accounts for testing:
    - **Email**: `alice@example.com`, **Password**: `password123`
    - **Email**: `bob@example.com`, **Password**: `password456`

---

## Server Actions (API)

This project uses Next.js Server Actions instead of traditional REST API endpoints. These actions are functions that run on the server and can be called directly from React components. They are defined in `src/lib/actions.js`.

| Action                   | Description                                                                          | Called From                                           |
| ------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `login`                  | Authenticates a user based on email and password and creates a session.              | `LoginForm.jsx`                                       |
| `signup`                 | Creates a new user account and starts a session.                                     | `SignUpForm.jsx`                                      |
| `logout`                 | Deletes the user's session cookie and logs them out.                                 | `AppSidebar.jsx`                                      |
| `createEvent`            | Creates a new event for the logged-in user.                                          | `CreateEventDialog.jsx`                               |
| `updateEventStatus`      | Changes the status of an event (e.g., from `BUSY` to `SWAPPABLE`).                       | `EventList.jsx`                                       |
| `createSwapRequest`      | Initiates a new swap request between the logged-in user and another user.            | `RequestSwapDialog.jsx`                               |
| `respondToSwapRequest`   | Allows a user to accept or reject an incoming swap request.                          | `IncomingRequests.jsx`                                |

---

## Assumptions & Challenges

### Assumptions

- The primary goal was to build a functional prototype focusing on user flow and application logic, not a production-ready system.
- The in-memory data store is sufficient for demonstration purposes. In a real-world scenario, this would be replaced by a robust database like PostgreSQL, MySQL, or a BaaS like Firebase Firestore.
- The authentication system is simplified for ease of use and is not secure for production. Real-world applications should use a dedicated authentication service (e.g., NextAuth.js, Firebase Auth, Clerk).

### Challenges

- **State Management with Server Components**: A key challenge was managing client-side state and triggering server-side data re-validation. The use of `revalidatePath` in Server Actions was crucial for ensuring the UI updates correctly after mutations.
- **Simulating a Database**: The in-memory data store required creating helper functions to simulate database operations like joins and relationships (e.g., populating user data on events). The `repopulateSwapRequest` function in `src/lib/data.js` is an example of a workaround for this.
- **Prop Drilling vs. Context**: For state that needed to be shared across components (like the list of a user's swappable slots in the `RequestSwapDialog`), the decision was made to pass props down from Server Components rather than introduce a complex client-side state management library to keep the architecture simple.