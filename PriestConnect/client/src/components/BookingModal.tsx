import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { addDocument } from '@/hooks/useFirestore';
import { useToast } from '@/hooks/use-toast';
import { PriestProfile } from '@shared/schema';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  priest: PriestProfile | null;
}

export default function BookingModal({ isOpen, onClose, priest }: BookingModalProps) {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !priest) return;

    setLoading(true);
    try {
      await addDocument('bookings', {
        institutionId: user.id,
        priestId: priest.id,
        serviceType,
        date,
        time,
        location,
        notes,
        status: 'pending',
        createdAt: new Date(),
      });

      toast({ title: "Booking request sent successfully" });
      onClose();
      
      // Reset form
      setServiceType('');
      setDate('');
      setTime('');
      setLocation('');
      setNotes('');
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Booking Request</DialogTitle>
        </DialogHeader>
        
        {priest && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-gray-600">
              Requesting service from: <strong>{priest.name}</strong> at {priest.parish}
            </div>
            
            <div>
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {priest.services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service === 'mass' && 'Mass'}
                      {service === 'confession' && 'Confession'}
                      {service === 'prayer_blessings' && 'Prayer/Blessings'}
                      {service === 'recollection_retreat' && 'Recollection/Retreat'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter venue address"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Sending...' : 'Send Request'}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
