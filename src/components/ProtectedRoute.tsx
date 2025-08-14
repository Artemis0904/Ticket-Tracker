import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event !== 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login', { replace: true });
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (checking) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
