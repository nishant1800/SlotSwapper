'use client';

import { format } from "date-fns";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowRight, Check, X } from "lucide-react";
import { respondToSwapRequest } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

function RequestCard({ request }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleResponse = async (accepted) => {
        setIsSubmitting(true);
        const result = await respondToSwapRequest(request.id, accepted);
        setIsSubmitting(false);

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: 'destructive' });
        } else {
            toast({ title: "Success!", description: result.success });
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${request.requester?.email}.png`} alt={request.requester?.name} />
                        <AvatarFallback>{request.requester?.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-md font-semibold">{request.requester.name} wants to swap</CardTitle>
                        <CardDescription>
                            Sent {format(new Date(request.createdAt), 'MMM d, yyyy')}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                <div className="space-y-1">
                    <p className="font-semibold text-muted-foreground text-sm">Their Slot</p>
                    <p className="font-bold">{request.requesterSlot.title}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(request.requesterSlot.startTime), 'EEE, p')}</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto" />
                <div className="space-y-1">
                    <p className="font-semibold text-muted-foreground text-sm">Your Slot</p>
                    <p className="font-bold">{request.responderSlot.title}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(request.responderSlot.startTime), 'EEE, p')}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleResponse(false)} disabled={isSubmitting}>
                    <X className="mr-2 h-4 w-4"/> Reject
                </Button>
                <Button onClick={() => handleResponse(true)} disabled={isSubmitting} className="bg-accent/80 text-accent-foreground hover:bg-accent">
                    <Check className="mr-2 h-4 w-4"/> Accept
                </Button>
            </CardFooter>
        </Card>
    );
}

export function IncomingRequests({ requests }) {

    if (requests.length === 0) {
        return (
            <div className="text-center py-16 border-dashed border-2 rounded-lg mt-2">
                <h3 className="text-xl font-semibold">No Incoming Requests</h3>
                <p className="text-muted-foreground mt-2">You have no pending swap requests from others.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 pt-4">
            {requests.map(req => <RequestCard key={req.id} request={req} />)}
        </div>
    );
}
