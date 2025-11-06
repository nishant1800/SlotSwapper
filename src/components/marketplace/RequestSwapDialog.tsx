'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { createSwapRequest } from '@/lib/actions';
import { ScrollArea } from '../ui/scroll-area';

export function RequestSwapDialog({ isOpen, onOpenChange, theirSlot, mySlots }) {
    const [selectedMySlotId, setSelectedMySlotId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!selectedMySlotId || !theirSlot) return;
        setIsSubmitting(true);
        const result = await createSwapRequest(selectedMySlotId, theirSlot.id);
        setIsSubmitting(false);

        if (result.error) {
            toast({ title: "Error", description: result.error, variant: 'destructive' });
        } else {
            toast({ title: "Success!", description: result.success });
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Request a Swap</DialogTitle>
                    <DialogDescription>
                        You are requesting to swap for{' '}
                        <span className="font-semibold text-primary">{theirSlot?.title}</span> on{' '}
                        <span className="font-semibold text-primary">{theirSlot ? format(new Date(theirSlot.startTime), 'MMM d') : ''}</span>.
                        <br/>
                        Choose one of your swappable slots to offer.
                    </DialogDescription>
                </DialogHeader>
                
                {mySlots.length > 0 ? (
                    <ScrollArea className="max-h-64">
                    <RadioGroup onValueChange={setSelectedMySlotId} className="space-y-2 p-1">
                        {mySlots.map(slot => (
                            <Label key={slot.id} htmlFor={slot.id} className="block">
                                <Card className="hover:bg-muted/50 cursor-pointer has-[[data-state=checked]]:border-primary">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <RadioGroupItem value={slot.id} id={slot.id} />
                                        <div>
                                            <p className="font-semibold">{slot.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(slot.startTime), 'EEE, MMM d')} &bull; {format(new Date(slot.startTime), 'p')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Label>
                        ))}
                    </RadioGroup>
                    </ScrollArea>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">You have no swappable slots to offer.</p>
                        <Button variant="link" asChild><a href="/dashboard">Go to Dashboard</a></Button>
                    </div>
                )}
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!selectedMySlotId || isSubmitting}>
                        {isSubmitting ? "Sending Request..." : "Send Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
