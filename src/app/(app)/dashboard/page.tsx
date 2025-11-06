import { getEventsByOwnerId } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { CreateEventDialog } from "@/components/dashboard/CreateEventDialog";
import { EventList } from "@/components/dashboard/EventList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  const events = await getEventsByOwnerId(session.user.id);

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome, {session?.user.name}!</h2>
                <p className="text-muted-foreground">Here are your upcoming time slots.</p>
            </div>
            <CreateEventDialog>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
            </CreateEventDialog>
        </div>
        <EventList events={events} />
    </div>
  );
}
