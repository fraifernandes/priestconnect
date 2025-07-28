import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Church, Bell, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Header() {
  const { user, signOut } = useAuth();
  const [location, setLocation] = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setLocation('/auth');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Church className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900">PriestConnect</h1>
            </div>
            <span className="text-sm text-gray-500 hidden sm:block">Diocese of Mangalore</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => setLocation('/dashboard')}
              className={`font-medium ${location === '/dashboard' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Dashboard
            </button>
            {user?.role === 'institution' && (
              <button 
                onClick={() => setLocation('/search')}
                className={`font-medium ${location === '/search' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Find Priests
              </button>
            )}
            <button 
              onClick={() => setLocation('/bookings')}
              className={`font-medium ${location === '/bookings' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Bookings
            </button>
            <button 
              onClick={() => setLocation('/profile')}
              className={`font-medium ${location === '/profile' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Profile
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user ? getInitials(user.name) : 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || 'User'}
              </span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
