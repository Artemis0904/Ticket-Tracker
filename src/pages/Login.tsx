import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TicketIcon } from 'lucide-react';
import SignUp from './SignUp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { toast } = useToast();

  const onSubmit = async (data: LoginForm) => {
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !signInData.session) {
      toast({ title: 'Sign in failed', description: error?.message ?? 'Unknown error', variant: 'destructive' });
      return;
    }

    // Fetch profile to route by department
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, department')
      .eq('id', signInData.session.user.id)
      .maybeSingle();

    if (profile?.username) localStorage.setItem('currentUser', profile.username);

    const dept = profile?.department as 'engineer' | 'regional_manager' | 'store_manager' | 'admin' | undefined;
    if (dept === 'store_manager') window.location.href = '/store-manager/dashboard';
    else if (dept === 'regional_manager') window.location.href = '/regional-manager/dashboard';
    else if (dept === 'engineer') window.location.href = '/engineer-dashboard';
    else window.location.href = '/dashboard';
  };
  if (showSignUp) {
    return <SignUp onBackToLogin={() => setShowSignUp(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <TicketIcon className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your TicketTrack account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="link" type="button" className="px-0 text-sm">
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  type="button"
                  onClick={() => setShowSignUp(true)}
                  className="px-0 text-sm font-medium"
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;