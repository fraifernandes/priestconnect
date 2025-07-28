import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCollection } from '@/hooks/useFirestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import PriestSearch from '@/components/PriestSearch';
import BookingModal from '@/components/BookingModal';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { CalendarCheck, CheckCircle, Clock, Users, Plus, UserCog, Bell } from 'lucide-react';
import { PriestProfile, Booking } from '@shared/schema';
import { where } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedPriest, setSelectedPriest] = useState<PriestProfile | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Fetch user's bookings
  const { data: bookings = [] } = useCollection(
    'bookings',
    user ? [where(user.role === 'priest' ? 'priestId' : 'institutionId', '==', user.id)] : []
  );

  // Fetch priest profiles for institutions
  const { data: priests = [] } = useCollection('priestProfiles');

  const handleBookingRequest = (priest: PriestProfile) => {
    setSelectedPriest(priest);
    setBookingModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getServiceLabel = (service: string) => {
    const labels = {
      mass: 'Mass',
      confession: 'Confession',
      prayer_blessings: 'Prayer/Blessings',
      recollection_retreat: 'Recollection/Retreat'
    };
    return labels[service as keyof typeof labels] || service;
  };

  // Calculate stats
  const upcomingBookings = bookings.filter((b: Booking) => 
    b.status === 'accepted' && new Date(b.date) > new Date()
  ).length;
  
  const confirmedBookings = bookings.filter((b: Booking) => b.status === 'accepted').length;
  const pendingBookings = bookings.filter((b: Booking) => b.status === 'pending').length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role Status Bar */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Viewing as:</span>
                  <Select value={user.role} disabled>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="institution">Institution User</SelectItem>
                      <SelectItem value="priest">Priest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">{confirmedBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {user.role === 'priest' ? 'Total Requests' : 'Available Priests'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.role === 'priest' ? bookings.length : priests.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Search (for institutions) or Requests (for priests) */}
          {user.role === 'institution' ? (
            <PriestSearch onBookingRequest={handleBookingRequest} />
          ) : (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No booking requests yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking: Booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {getServiceLabel(booking.serviceType)}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {booking.date} at {booking.time}
                            </p>
                            <p className="text-sm text-gray-600">{booking.location}</p>
                            {booking.notes && (
                              <p className="text-sm text-gray-500 mt-1">{booking.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(booking.status)}
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">Accept</Button>
                                <Button size="sm" variant="outline">Decline</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Right Column: Recent Bookings & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.slice(0, 3).length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No recent bookings
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking: Booking) => (
                      <div key={booking.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {getServiceLabel(booking.serviceType)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.date} - {booking.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={() => setBookingModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Booking Request
                </Button>
                <Button variant="outline" className="w-full">
                  <UserCog className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Priest Calendar (only for priests) */}
        {user.role === 'priest' && (
          <AvailabilityCalendar />
        )}

        {/* Booking Modal */}
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          priest={selectedPriest}
        />
      </main>
    </div>
  );
}
