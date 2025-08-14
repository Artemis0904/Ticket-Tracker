import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, Package, FileText, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface EngineerLayoutProps {
  children: ReactNode;
}

const EngineerLayout = ({ children }: EngineerLayoutProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Returns',
      icon: Package,
      onClick: () => {
        navigate('/engineer/returns');
        setIsMenuOpen(false);
      }
    },
    {
      label: 'Reports',
      icon: FileText,
      onClick: () => {
        navigate('/engineer/reports');
        setIsMenuOpen(false);
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex-1 p-4">
                    <div className="space-y-2">
                      {menuItems.map((item) => (
                        <Button
                          key={item.label}
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12"
                          onClick={item.onClick}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-bold text-primary">Engineer Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{localStorage.getItem('currentUser') || 'Engineer'}</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>EN</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

export default EngineerLayout;