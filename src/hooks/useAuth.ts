import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppDepartment = 'engineer' | 'regional_manager' | 'store_manager' | 'admin';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [department, setDepartment] = useState<AppDepartment | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(async () => {
          const { data } = await supabase
            .from('profiles')
            .select('department')
            .eq('id', session.user!.id)
            .maybeSingle();
          setDepartment((data?.department as AppDepartment) ?? null);
        }, 0);
      } else {
        setDepartment(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('department')
          .eq('id', session.user.id)
          .maybeSingle();
        setDepartment((data?.department as AppDepartment) ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { loading, user, department };
}

export function redirectByDepartment(dept: AppDepartment | null) {
  switch (dept) {
    case 'engineer':
      window.location.href = '/engineer-dashboard';
      break;
    case 'regional_manager':
      window.location.href = '/regional-manager/dashboard';
      break;
    case 'store_manager':
      window.location.href = '/store-manager/dashboard';
      break;
    default:
      window.location.href = '/dashboard';
  }
}
