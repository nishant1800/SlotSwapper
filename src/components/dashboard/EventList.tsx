'use client';

import { format } from 'date-fns';
import { Calendar, Clock, MoreVertical, Repeat, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Event, EventStatus } from '@/lib/definitions';
import { updateEventStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge
      variant={
        status === EventStatus.SWAPPABLE ? 'secondary' :
        status === EventStatus.SWAP_PENDING ? 'outline' : 'default'
      }
      className={cn({
        'bg-accent/80 text-accent-foreground': status === EventStatus.SWAPPABLE,
      })}
    >
      {status}
    </Badge>
  );
}

export function EventList({ events }: { events: Event[] }) {
    const { toast } = useToast();

    const handleStatusChange = async (eventId: string, status: EventStatus) => {
        const result = await updateEventStatus(eventId, status);
        if (result?.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive'
            });
        } else {
            toast({
                title: 'Success',
                description: `Event status updated to ${status}.`
            });
        }
    };

    if (events.length === 0) {
        return (
            <div className="text-center py-16 border-dashed border-2 rounded-lg">
                <h3 className="text-xl font-semibold">No events yet</h3>
                <p className="text-muted-foreground mt-2">Create your first event to get started.</p>
            </div>
        )
    }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
              {event.status !== EventStatus.SWAP_PENDING && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {event.status === EventStatus.BUSY && (
                     <DropdownMenuItem onClick={() => handleStatusChange(event.id, EventStatus.SWAPPABLE)}>
                        <Repeat className="mr-2 h-4 w-4" />
                        <span>Make Swappable</span>
                    </DropdownMenuItem>
                  )}
                  {event.status === EventStatus.SWAPPABLE && (
                     <DropdownMenuItem onClick={() => handleStatusChange(event.id, EventStatus.BUSY)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        <span>Make Busy</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </div>
            <CardDescription className="flex items-center gap-2 pt-2">
                <StatusBadge status={event.status} />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{format(new Date(event.startTime), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>{`${format(new Date(event.startTime), 'p')} - ${format(new Date(event.endTime), 'p')}`}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
