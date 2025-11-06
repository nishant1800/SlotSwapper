'use client';

import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SwapRequestStatus } from "@/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

function StatusBadge({ status }) {
    return (
      <Badge
        variant={
            status === SwapRequestStatus.ACCEPTED ? 'secondary' :
            status === SwapRequestStatus.REJECTED ? 'destructive' : 'outline'
        }
        className={cn("capitalize", {
          'bg-accent/80 text-accent-foreground': status === SwapRequestStatus.ACCEPTED,
        })}
      >
        {status.toLowerCase()}
      </Badge>
    );
  }

function RequestCard({ request }) {
    return (
        <Card className="opacity-80">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${request.responder?.email}.png`} alt={request.responder?.name} />
                            <AvatarFallback>{request.responder?.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-md font-semibold">Request to {request.responder.name}</CardTitle>
                            <CardDescription>
                                Sent {format(new Date(request.createdAt), 'MMM d, yyyy')}
                            </CardDescription>
                        </div>
                    </div>
                    <StatusBadge status={request.status} />
                </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                <div className="space-y-1">
                    <p className="font-semibold text-muted-foreground text-sm">Your Offered Slot</p>
                    <p className="font-bold">{request.requesterSlot.title}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(request.requesterSlot.startTime), 'EEE, p')}</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                    <p className="font-semibold text-muted-foreground text-sm">Their Slot</p>
                    <p className="font-bold">{request.responderSlot.title}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(request.responderSlot.startTime), 'EEE, p')}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function OutgoingRequests({ requests }) {

    if (requests.length === 0) {
        return (
            <div className="text-center py-16 border-dashed border-2 rounded-lg mt-2">
                <h3 className="text-xl font-semibold">No Outgoing Requests</h3>
                <p className="text-muted-foreground mt-2">You haven't requested any swaps yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 pt-4">
            {requests.map(req => <RequestCard key={req.id} request={req} />)}
        </div>
    );
}
