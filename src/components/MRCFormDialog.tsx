import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore, MaterialItemRow } from '@/store/appStore';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { notify } from '@/lib/notifications';
import { useAuth } from '@/hooks/useAuth';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface MRCFormDialogProps { trigger?: React.ReactNode }

type ZoneOption = 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D';
type TransportMode = 'Train' | 'Bus' | 'Courier';

const defaultRows = (count = 5): MaterialItemRow[] =>
  Array.from({ length: count }).map((_, idx) => ({
    id: `row_${idx + 1}_${Math.random().toString(36).slice(2, 7)}`,
    description: '',
    quantity: 0, // keep base field but we will use returnQty
    source: 'Store',
    urgency: 'Low',
    returnQty: 0,
    transportModeRow: undefined,
    receivedQty: 0,
    mrcNo: '',
    remarks: '',
  }));

export default function MRCFormDialog({ trigger }: MRCFormDialogProps) {
  const { addMaterialRequest } = useAppStore();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showTransportDialog, setShowTransportDialog] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [zone, setZone] = useState<ZoneOption>('Zone A');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState<MaterialItemRow[]>(defaultRows());
  const [transportMode, setTransportMode] = useState<TransportMode>('Train');
  const [edt, setEdt] = useState<Date | undefined>(undefined);
  const [trackingNo, setTrackingNo] = useState('');

  useEffect(() => {
    if (!open) {
      setTicketNumber('');
      setZone('Zone A');
      setDescription('');
      setRows(defaultRows());
      setShowTransportDialog(false);
      setTransportMode('Train');
      setEdt(undefined);
      setTrackingNo('');
    }
  }, [open]);

  const canSubmit = useMemo(() => rows.some(r => r.description.trim() && (r.returnQty || 0) > 0), [rows]);

  const onAddRow = () => setRows(prev => [...prev, ...defaultRows(1)]);
  const onDeleteRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));
  const onChangeRow = (id: string, patch: Partial<MaterialItemRow>) => setRows(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const onSubmit = async () => {
    const filtered = rows.filter(r => r.description.trim() && (r.returnQty || 0) > 0);
    if (filtered.length === 0) return;
    setShowTransportDialog(true);
  };

  const onFinalSubmit = async () => {
    const filtered = rows.filter(r => r.description.trim() && (r.returnQty || 0) > 0);
    if (filtered.length === 0) return;
    
    const reqTitle = ticketNumber.trim() ? `MRC ${ticketNumber.trim()}` : `MRC (${filtered.length} item${filtered.length > 1 ? 's' : ''})`;
    
    const extra = {
      ticketNumber: ticketNumber.trim(),
      zone,
      description: description.trim(),
      requesterEmail: user?.email ?? undefined,
      requesterId: user?.id ?? undefined,
      requestType: 'MRC' as const,
      transportMode,
      ...(transportMode === 'Courier' ? { trackingNo } : { edt: edt?.toISOString() }),
    };

    addMaterialRequest(reqTitle, filtered, extra);
    toast.success('MRC submitted successfully.');
    setOpen(false);
    setShowTransportDialog(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button className="gap-2">MRC Form</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>New MRC (Material Return)</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-4 py-1">
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
                    <TableHead className="w-[50%]">Item Description</TableHead>
                    <TableHead className="w-32">Return Qty</TableHead>
                    <TableHead className="w-64">Remarks</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Textarea 
                          value={row.description} 
                          onChange={(e) => onChangeRow(row.id, { description: e.target.value })} 
                          placeholder="Describe the item in detail"
                          className="min-h-[60px] resize-none"
                        />
                      </TableCell>
                      <TableCell>
                        <Input type="number" min={0} value={row.returnQty ?? ''} onChange={(e) => onChangeRow(row.id, { returnQty: Number(e.target.value) })} placeholder="0" />
                      </TableCell>
                      <TableCell>
                        <Textarea 
                          value={row.remarks ?? ''} 
                          onChange={(e) => onChangeRow(row.id, { remarks: e.target.value })} 
                          placeholder="Additional remarks"
                          className="min-h-[60px] resize-none"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteRow(row.id)} aria-label="Delete row">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mrc-description">Description</Label>
                <Textarea id="mrc-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add any additional details for this return" />
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={onAddRow} className="gap-2">
                  <Plus className="h-4 w-4" /> Add row
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!canSubmit}>Submit MRC</Button>
        </DialogFooter>
      </DialogContent>

      {/* Transport Mode Dialog */}
      <Dialog open={showTransportDialog} onOpenChange={setShowTransportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Transport Mode</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mode of Transport</Label>
              <Select value={transportMode} onValueChange={(v) => setTransportMode(v as TransportMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Train">Train</SelectItem>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(transportMode === 'Train' || transportMode === 'Bus') && (
              <div className="space-y-2">
                <Label>Enter EDT (Estimated Delivery Time)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {edt ? format(edt, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={edt}
                      onSelect={setEdt}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {transportMode === 'Courier' && (
              <div className="space-y-2">
                <Label>Enter Tracking Number</Label>
                <Input
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowTransportDialog(false)}>Cancel</Button>
            <Button 
              onClick={onFinalSubmit} 
              disabled={
                (transportMode === 'Courier' && !trackingNo.trim()) ||
                ((transportMode === 'Train' || transportMode === 'Bus') && !edt)
              }
            >
              Submit MRC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
