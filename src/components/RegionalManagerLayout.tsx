import React, { ReactNode, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MenuIcon, 
  PlusIcon,
  LogOutIcon,
  TicketIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RegionalManagerLayoutProps {
  children: ReactNode;
}

const RegionalManagerLayout = ({ children }: RegionalManagerLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      label: 'MR Form',
      icon: PlusIcon,
      onClick: () => {
        navigate('/regional-manager/mr-form');
        setIsOpen(false);
      }
    }
  ];

  const handleLogout = () => {
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-4">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <TicketIcon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold">Regional Manager</h2>
                </div>

                <nav className="flex-1 space-y-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={item.onClick}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>

                <div className="border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <TicketIcon className="h-3 w-3 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold">Regional Material Management</h1>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
              <AvatarFallback>RM</AvatarFallback>
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

export default RegionalManagerLayout;