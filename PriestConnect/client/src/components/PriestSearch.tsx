import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, User, MapPin } from 'lucide-react';
import { useCollection } from '@/hooks/useFirestore';
import { PriestProfile } from '@shared/schema';
import { where } from 'firebase/firestore';

interface PriestSearchProps {
  onBookingRequest: (priest: PriestProfile) => void;
}

export default function PriestSearch({ onBookingRequest }: PriestSearchProps) {
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [filteredPriests, setFilteredPriests] = useState<PriestProfile[]>([]);

  const { data: priests, loading } = useCollection('priestProfiles');

  useEffect(() => {
    if (!priests) return;
    
    let filtered = priests;

    if (serviceType) {
      filtered = filtered.filter((priest: PriestProfile) => 
        priest.services.includes(serviceType as any)
      );
    }

    if (location) {
      filtered = filtered.filter((priest: PriestProfile) => 
        priest.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredPriests(filtered);
  }, [priests, serviceType, location, date]);

  const getServiceLabel = (service: string) => {
    const labels = {
      mass: 'Mass',
      confession: 'Confession',
      prayer_blessings: 'Prayer/Blessings',
      recollection_retreat: 'Recollection/Retreat'
    };
    return labels[service as keyof typeof labels] || service;
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="mr-2 h-5 w-5 text-primary" />
          Find Available Priests
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Search Filters */}
        <div className="p-6 bg-gray-50 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="service">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Services</SelectItem>
                  <SelectItem value="mass">Mass</SelectItem>
                  <SelectItem value="confession">Confession</SelectItem>
                  <SelectItem value="prayer_blessings">Prayer/Blessings</SelectItem>
                  <SelectItem value="recollection_retreat">Recollection/Retreat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
              />
            </div>
          </div>
          
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search Priests
          </Button>
        </div>

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Available Priests ({filteredPriests.length} found)
            </h4>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading priests...</div>
          ) : filteredPriests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No priests found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPriests.map((priest) => (
                <div key={priest.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{priest.name}</h5>
                        <p className="text-sm text-gray-600">{priest.parish}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {priest.location}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {priest.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {getServiceLabel(service)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        onClick={() => onBookingRequest(priest)}
                        size="sm"
                      >
                        Request Booking
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
