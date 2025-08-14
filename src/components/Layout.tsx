import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TicketIcon, 
  HomeIcon, 
  PlusIcon, 
  UsersIcon, 
  SettingsIcon, 
  BellIcon 
} from 'lucide-react';
import { mockUsers } from '@/data/mockData';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentUser = mockUsers[0]; // Admin user

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tickets', href: '/tickets', icon: TicketIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <TicketIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">TicketTrack</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/tickets/new">
              <Button size="sm" className="gap-2">
                <PlusIcon className="h-4 w-4" />
                New Ticket
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm">
              <BellIcon className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;