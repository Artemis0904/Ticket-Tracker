import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { MaterialItemRow, MaterialRequest, useAppStore, SourceOption } from '@/store/appStore';
import { toast } from 'sonner';
import { notify } from '@/lib/notifications';

interface SMRequestViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaterialRequest;
}

type TransportMode = 'Train' | 'Bus' | 'Courier';

export default function SMRequestViewer({ open, onOpenChange, request }: SMRequestViewerProps) {
  const { updateRequest, updateStatus } = useAppStore();

  const [rows, setRows] = useState<MaterialItemRow[]>(request.items || []);
  const [sendOpen, setSendOpen] = useState(false);
  const [mode, setMode] = useState<TransportMode | undefined>(request.transportMode as TransportMode | undefined);
  const [edt, setEdt] = useState<Date | undefined>(request.edt ? new Date(request.edt) : undefined);
  const [tracking, setTracking] = useState<string>(request.trackingNo || '');
  const [courierName, setCourierName] = useState<string>('');

  useEffect(() => {
    if (open) {
      setRows(request.items || []);
      setMode(request.transportMode as TransportMode | undefined);
      setEdt(request.edt ? new Date(request.edt) : undefined);
      setTracking(request.trackingNo || '');
      setCourierName('');
    }
  }, [open, request]);

  const canSave = useMemo(() => true, []);

  const onChangeRow = (id: string, patch: Partial<MaterialItemRow>) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const onConfirm = async () => {
    try {
      await updateRequest(request.id, { items: rows });
      toast.success('Updates saved.');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save updates. Please try again.');
      console.error('Error saving updates:', error);
    }
  };

  const onConfirmSend = async () => {
    if (!mode) {
      toast.error('Please select Mode of transport.');
      return;
    }
    if ((mode === 'Train' || mode === 'Bus') && !edt) {
      toast.error('Please select EDT.');
      return;
    }
    if (mode === 'Courier' && !courierName.trim()) {
      toast.error('Please enter Courier Name.');
      return;
    }
    if (mode === 'Courier' && !tracking.trim()) {
      toast.error('Please enter Tracking No.');
      return;
    }
    
    try {
      await updateRequest(request.id, {
        transportMode: mode,
        edt: edt ? edt.toISOString() : undefined,
        trackingNo: tracking.trim() || undefined,
        sentAt: new Date().toISOString(),
      });
      await updateStatus(request.id, 'in-transit');
      
      // Send notification about items being sent
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
            status: 'in-transit',
            requestedBy: request.requestedBy,
            requesterEmail: request.requesterEmail ?? null,
          },
          extraRecipients: [],
        });
      } catch (error) {
        console.error('Failed to send shipment notification:', error);
      }
      
      toast.success('Marked as sent.');
      setSendOpen(false);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to mark as sent. Please try again.');
      console.error('Error marking as sent:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Request Details (Read-only)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-number">Ticket Number</Label>
              <Input id="ticket-number" value={request.ticketNumber || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zone">Zone</Label>
              <Input id="zone" value={request.zone || ''} disabled />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="mr-description">Description</Label>
              <Textarea id="mr-description" value={request.description || ''} disabled />
            </div>
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
                  <TableHead className="w-40">Sent Qty</TableHead>
                  <TableHead className="w-40">MRF No.</TableHead>
                  <TableHead className="w-40">MiF No.</TableHead>
                  <TableHead className="w-64">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      <Input value={row.description} disabled />
                    </TableCell>
                    <TableCell>
                      <Input type="number" min={0} value={row.quantity || ''} disabled />
                    </TableCell>
                    <TableCell>
                      <Select value={row.source} onValueChange={(v) => onChangeRow(row.id, { source: v as SourceOption })}>
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
                      <Input value={row.urgency} disabled />
                    </TableCell>
                    <TableCell>
                      <Input type="number" min={0} value={row.approvedQty ?? ''} disabled />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={row.sentQty ?? ''}
                        onChange={(e) => onChangeRow(row.id, { sentQty: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.mrfNo ?? ''}
                        onChange={(e) => onChangeRow(row.id, { mrfNo: e.target.value })}
                        placeholder="Enter MRF No."
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.mifNo ?? ''}
                        onChange={(e) => onChangeRow(row.id, { mifNo: e.target.value })}
                        placeholder="Enter MiF No."
                        disabled={row.source !== 'Store'}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.remarks ?? ''}
                        onChange={(e) => onChangeRow(row.id, { remarks: e.target.value })}
                        placeholder="Remarks"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Button variant="secondary" onClick={onConfirm} disabled={!canSave}>Confirm</Button>
          <Button onClick={() => setSendOpen(true)}>Sent</Button>
        </DialogFooter>
      </DialogContent>

      {/* Send dialog */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Sent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mode of transport</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as TransportMode)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="Train">Train</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(mode === 'Train' || mode === 'Bus') && (
              <div className="space-y-2">
                <Label>Enter EDT</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {edt ? edt.toDateString() : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={edt}
                      onSelect={setEdt}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {mode === 'Courier' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter Courier Name</Label>
                  <Input value={courierName} onChange={(e) => setCourierName(e.target.value)} placeholder="Courier name" />
                </div>
                <div className="space-y-2">
                  <Label>Enter Tracking No.</Label>
                  <Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking number" />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSendOpen(false)}>Cancel</Button>
            <Button onClick={onConfirmSend}>Confirm & Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
