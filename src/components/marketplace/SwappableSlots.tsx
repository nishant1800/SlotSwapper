'use client';

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Repeat } from "lucide-react";
import { RequestSwapDialog } from "./RequestSwapDialog";

export function SwappableSlots({ availableSlots, mySwappableSlots }) {
    const [selectedSlot, setSelectedSlot] = useState(null);

    if (availableSlots.length === 0) {
        return (
            <div className="text-center py-16 border-dashed border-2 rounded-lg">
                <h3 className="text-xl font-semibold">Marketplace is Empty</h3>
                <p className="text-muted-foreground mt-2">No one has made any slots swappable yet. Check back later!</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {availableSlots.map((slot) => (
                    <Card key={slot.id}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={`https://avatar.vercel.sh/${slot.owner?.email}.png`} alt={slot.owner?.name} />
                                    <AvatarFallback>{slot.owner?.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">{slot.title}</CardTitle>
                                    <CardDescription>from {slot.owner?.name}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{format(new Date(slot.startTime), 'EEE, MMM d')}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>{`${format(new Date(slot.startTime), 'p')} - ${format(new Date(slot.endTime), 'p')}`}</span>
                            </div>
                            <Button className="w-full mt-2 bg-accent/80 hover:bg-accent text-accent-foreground" onClick={() => setSelectedSlot(slot)}>
                                <Repeat className="mr-2 h-4 w-4" />
                                Request Swap
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <RequestSwapDialog 
                isOpen={!!selectedSlot} 
                onOpenChange={(open) => !open && setSelectedSlot(null)}
                theirSlot={selectedSlot}
                mySlots={mySwappableSlots}
            />
        </>
    )
}
