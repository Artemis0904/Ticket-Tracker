import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialItemRow, MaterialRequest, useAppStore } from '@/store/appStore';
import { toast } from 'sonner';
import { notify } from '@/lib/notifications';

interface RMRequestEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaterialRequest;
}

type ZoneOption = 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D';

export default function RMRequestEditor({ open, onOpenChange, request }: RMRequestEditorProps) {
  const { updateRequest, updateStatus } = useAppStore();

  const [ticketNumber, setTicketNumber] = useState(request.ticketNumber || '');
  const [zone, setZone] = useState<ZoneOption>((request.zone as ZoneOption) || 'Zone A');
  const [description, setDescription] = useState(request.description || '');
  const [rows, setRows] = useState<MaterialItemRow[]>(request.items || []);

  useEffect(() => {
    if (open) {
      setTicketNumber(request.ticketNumber || '');
      setZone(((request.zone as ZoneOption) || 'Zone A'));
      setDescription(request.description || '');
      setRows(request.items || []);
    }
  }, [open, request]);

  const canSave = useMemo(() => rows.some(r => r.description.trim() && (r.quantity ?? 0) >= 0), [rows]);

  const onChangeRow = (id: string, patch: Partial<MaterialItemRow>) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const onSave = async () => {
    try {
      await updateRequest(request.id, { items: rows, ticketNumber: ticketNumber.trim(), zone, description: description.trim() });
      toast.success('Request updated.');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update request. Please try again.');
      console.error('Error updating request:', error);
    }
  };

  const onApprove = async () => {
    try {
      await updateStatus(request.id, 'approved');
      await notify({
        eventType: 'MR_APPROVED',
        zone: request.zone,
        request: {
          id: request.id,
          title: request.title,
          ticketNumber: request.ticketNumber,
          zone: request.zone,
          description: request.description,
          status: 'approved',
          requestedBy: request.requestedBy,
          requesterEmail: request.requesterEmail ?? null,
        },
        targetDepartments: ['store_manager'],
        extraRecipients: request.requesterEmail ? [request.requesterEmail] : [],
      });
      
      // Also send a status change notification
      await notify({
        eventType: 'MR_STATUS_CHANGED',
        zone: request.zone,
        request: {
          id: request.id,
          title: request.title,
          ticketNumber: request.ticketNumber,
          zone: request.zone,
          description: request.description,
          status: 'approved',
          requestedBy: request.requestedBy,
          requesterEmail: request.requesterEmail ?? null,
        },
        extraRecipients: request.requesterEmail ? [request.requesterEmail] : [],
      });
      
      toast.success('Request approved and sent to Store Manager.');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to approve request. Please try again.');
      console.error('Error approving request:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Material Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-number">Ticket Number</Label>
            <Input id="ticket-number" value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} placeholder="e.g., TKT-00123" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Select value={zone} onValueChange={(v) => setZone(v as ZoneOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="Zone A">Zone A</SelectItem>
                <SelectItem value="Zone B">Zone B</SelectItem>
                <SelectItem value="Zone C">Zone C</SelectItem>
                <SelectItem value="Zone D">Zone D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sl No</TableHead>
                  <TableHead>Item Desc</TableHead>
                  <TableHead className="w-32">Required Qty</TableHead>
                  <TableHead className="w-40">Source</TableHead>
                  <TableHead className="w-40">Urgency</TableHead>
                  <TableHead className="w-40">Approved Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Input
                        value={row.description}
                        onChange={(e) => onChangeRow(row.id, { description: e.target.value })}
                        placeholder="Describe the item"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={row.quantity || ''}
                        onChange={(e) => onChangeRow(row.id, { quantity: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={row.source} onValueChange={(v) => onChangeRow(row.id, { source: v as MaterialItemRow['source'] })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          <SelectItem value="Store">Store</SelectItem>
                          <SelectItem value="CSD">CSD</SelectItem>
                          <SelectItem value="Site Purchase">Site Purchase</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={row.urgency} onValueChange={(v) => onChangeRow(row.id, { urgency: v as MaterialItemRow['urgency'] })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Urgency" />
                        </SelectTrigger>
                        <SelectContent className="z-50">
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={row.approvedQty ?? ''}
                        onChange={(e) => onChangeRow(row.id, { approvedQty: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mr-description">Description</Label>
            <Textarea
              id="mr-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional details for this request"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="secondary" onClick={onSave} disabled={!canSave}>Confirm</Button>
          <Button onClick={onApprove}>Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
