import { getIncomingRequests, getOutgoingRequests, repopulateSwapRequest } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomingRequests } from "@/components/requests/IncomingRequests";
import { OutgoingRequests } from "@/components/requests/OutgoingRequests";

export default async function RequestsPage() {
    const session = await getSession();
    const rawIncoming = await getIncomingRequests(session.user.id);
    const rawOutgoing = await getOutgoingRequests(session.user.id);
    
    // In-memory data requires re-populating relations that might have changed
    const incomingRequests = rawIncoming.map(repopulateSwapRequest);
    const outgoingRequests = rawOutgoing.map(repopulateSwapRequest);

    return (
        <div className="space-y-6">
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Swap Requests</h2>
                <p className="text-muted-foreground">Manage your incoming and outgoing swap requests.</p>
            </div>
            <Tabs defaultValue="incoming">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="incoming">Incoming ({incomingRequests.length})</TabsTrigger>
                    <TabsTrigger value="outgoing">Outgoing ({outgoingRequests.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="incoming">
                    <IncomingRequests requests={incomingRequests} />
                </TabsContent>
                <TabsContent value="outgoing">
                    <OutgoingRequests requests={outgoingRequests} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
