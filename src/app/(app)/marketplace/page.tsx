import { getSwappableEvents, getMySwappableSlots } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { SwappableSlots } from "@/components/marketplace/SwappableSlots";

export default async function MarketplacePage() {
    const session = await getSession();
    const availableSlots = await getSwappableEvents(session.user.id);
    const mySwappableSlots = await getMySwappableSlots(session.user.id);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Marketplace</h2>
                <p className="text-muted-foreground">Browse available slots to swap with.</p>
            </div>
            <SwappableSlots availableSlots={availableSlots} mySwappableSlots={mySwappableSlots} />
        </div>
    )
}
