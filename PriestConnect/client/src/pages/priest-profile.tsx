import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDocument, addDocument, updateDocument } from '@/hooks/useFirestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { PriestProfile } from '@shared/schema';

export default function PriestProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [parish, setParish] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: profile, loading: profileLoading } = useDocument(
    'priestProfiles',
    user?.id || ''
  );

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setParish(profile.parish || '');
      setLocation(profile.location || '');
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setServices(profile.services || []);
    }
  }, [profile]);

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setServices([...services, service]);
    } else {
      setServices(services.filter(s => s !== service));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const profileData = {
        userId: user.id,
        name,
        parish,
        location,
        bio,
        phone,
        services,
      };

      if (profile) {
        await updateDocument('priestProfiles', profile.id, profileData);
        toast({ title: "Profile updated successfully" });
      } else {
        await addDocument('priestProfiles', profileData);
        toast({ title: "Profile created successfully" });
      }
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

  if (!user || user.role !== 'priest') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Access denied. Priest role required.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Priest Profile</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="parish">Parish/Church</Label>
                  <Input
                    id="parish"
                    value={parish}
                    onChange={(e) => setParish(e.target.value)}
                    placeholder="Enter your parish or church"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, District"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio/Description</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your ministry..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Services Offered</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { id: 'mass', label: 'Mass' },
                    { id: 'confession', label: 'Confession' },
                    { id: 'prayer_blessings', label: 'Prayer/Blessings' },
                    { id: 'recollection_retreat', label: 'Recollection/Retreat' },
                  ].map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={services.includes(service.id)}
                        onCheckedChange={(checked) => 
                          handleServiceChange(service.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={service.id}>{service.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
