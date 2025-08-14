import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MaterialRequest, useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { notify } from '@/lib/notifications';

interface EngineerShipmentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaterialRequest;
}

export default function EngineerShipmentViewer({ open, onOpenChange, request }: EngineerShipmentViewerProps) {
  const { updateStatus, updateRequest } = useAppStore();
  const [receivedMap, setReceivedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      const init: Record<string, boolean> = {};
      (request.items || []).forEach((it) => (init[it.id] = false));
      setReceivedMap(init);
    }
  }, [open, request]);

  const allChecked = useMemo(
    () => Object.values(receivedMap).length > 0 && Object.values(receivedMap).every(Boolean),
    [receivedMap]
  );

  const handleToggle = (id: string, value: boolean) => {
    setReceivedMap((prev) => ({ ...prev, [id]: value }));
  };

  const onConfirmReceived = async () => {
    const missingItems = request.items.filter((it) => !receivedMap[it.id]);

    try {
      if (missingItems.length > 0) {
        // Add automatic remarks for missing items so Store Manager can see
        const patchedItems = request.items.map((it) =>
          missingItems.find((m) => m.id === it.id)
            ? { ...it, remarks: it.remarks ? `${it.remarks} | Missing on receipt` : 'Missing on receipt' }
            : it
        );
        await updateRequest(request.id, { items: patchedItems });
        toast.error(`${missingItems.length} item(s) missing. Notification sent to Store Manager.`);
      } else {
        toast.success('All items received.');
      }

      // Mark ticket as delivered (received)
      await updateStatus(request.id, 'delivered');
      
      // Send notification about delivery completion
      try {
        await notify({
          eventType: 'MR_STATUS_CHANGED',
          zone: request.zone,
          request: {
            id: request.id,
            title: request.title,
            ticketNumber: request.ticketNumber,
            zone: request.zone,
            description: request.description,
            status: 'delivered',
            requestedBy: request.requestedBy,
            requesterEmail: request.requesterEmail ?? null,
          },
          extraRecipients: [],
        });
      } catch (error) {
        console.error('Failed to send delivery notification:', error);
      }
      
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update status. Please try again.');
      console.error('Error updating status:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Shipment Details - Mark Items as Received</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Check the boxes next to items you have received. Items not checked will be marked as missing.
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Shipment Information - Read Only */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Ticket Number</div>
              <div className="text-sm">{request.ticketNumber || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Zone</div>
              <div className="text-sm">{request.zone || '—'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Transport Mode</div>
              <div className="text-sm">{request.transportMode || '—'}</div>
            </div>
            {request.trackingNo && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Tracking Number</div>
                <div className="text-sm font-mono">{request.trackingNo}</div>
              </div>
            )}
            {request.sentAt && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Sent Date</div>
                <div className="text-sm">{new Date(request.sentAt).toLocaleDateString()}</div>
              </div>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
                              <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Sl No</TableHead>
                    <TableHead>Item Description</TableHead>
                    <TableHead className="w-32">Required Qty</TableHead>
                    <TableHead className="w-40">Approved Qty</TableHead>
                    <TableHead className="w-40">Sent Qty</TableHead>
                    <TableHead className="w-40">
                      <div className="flex items-center gap-2">
                        <span>Received</span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          Editable
                        </span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {request.items.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.quantity ?? 0}</TableCell>
                    <TableCell>{row.approvedQty ?? '—'}</TableCell>
                    <TableCell>{row.sentQty ?? '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`chk-${row.id}`}
                          checked={!!receivedMap[row.id]}
                          onCheckedChange={(v) => handleToggle(row.id, Boolean(v))}
                        />
                        <Label htmlFor={`chk-${row.id}`}>Received</Label>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Button 
            onClick={onConfirmReceived} 
            disabled={request.items.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirm Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
