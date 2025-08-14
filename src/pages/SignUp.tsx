import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TicketIcon, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().regex(/^[+]?[\d\s-()]+$/, 'Please enter a valid mobile number'),
  department: z.string().min(1, 'Please select a department'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  zone: z.string().min(1, 'Please select a zone'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

interface SignUpProps {
  onBackToLogin: () => void;
}

const departments = [
  'Admin',
  'Regional manager', 
  'Engineer',
  'Store manager',
];

const zones = [
  'North Zone',
  'South Zone',
  'East Zone',
  'West Zone',
  'Central Zone',
  'International',
];

const SignUp = ({ onBackToLogin }: SignUpProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const selectedZone = watch('zone');
  const selectedDepartment = watch('department');

  const { toast } = useToast();

  const normalizeDepartment = (d: string) => {
    const v = d.toLowerCase();
    if (v.includes('regional')) return 'regional_manager';
    if (v.includes('store')) return 'store_manager';
    if (v.includes('engineer')) return 'engineer';
    if (v.includes('admin')) return 'admin';
    return 'engineer';
  };

  const onSubmit = async (data: SignUpForm) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: data.username,
          mobile: data.mobile,
          zone: data.zone,
          department: normalizeDepartment(data.department),
        },
      },
    });

    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Check your email', description: 'We sent you a confirmation link to complete sign up.' });
    onBackToLogin();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLogin}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Button>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <TicketIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="w-[88px]"></div> {/* Spacer for center alignment */}
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join TicketTrack and start managing tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  {...register('username')}
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  placeholder="Enter your mobile number"
                  {...register('mobile')}
                  className={errors.mobile ? 'border-destructive' : ''}
                />
                {errors.mobile && (
                  <p className="text-sm text-destructive">{errors.mobile.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(value) => setValue('department', value)} value={selectedDepartment}>
                  <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-destructive">{errors.department.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select onValueChange={(value) => setValue('zone', value)} value={selectedZone}>
                  <SelectTrigger className={errors.zone ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select your zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.zone && (
                  <p className="text-sm text-destructive">{errors.zone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-destructive' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;