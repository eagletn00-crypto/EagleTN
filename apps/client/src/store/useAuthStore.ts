import { create } from 'zustand';
import { supabase } from '@eagle/database';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoadingSession: boolean;
  isLoggingIn: boolean;
  
  initializeAuth: () => void;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoadingSession: true,
  isLoggingIn: false,

  initializeAuth: () => {
    const syncProfile = async (authUser: User) => {
      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("[EAGLE TN Engine] Profile fetch error:", fetchError);
        }

        if (!existingProfile) {
          const newProfile = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || 'Client EAGLE',
            email: authUser.email || '',
            avatar_url: authUser.user_metadata?.avatar_url,
            updated_at: new Date().toISOString(),
          };
          const { error: insertError } = await supabase.from('profiles').insert([newProfile]);
          if (insertError) throw insertError;
          set({ profile: newProfile });
        } else {
          set({ profile: existingProfile });
        }
      } catch (error) {
        console.error("[EAGLE TN Engine] Profile sync error:", error);
      } finally {
        set({ user: authUser, isLoadingSession: false });
      }
    };

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        set({ isLoadingSession: false });
      } else if (session?.user) {
        syncProfile(session.user);
      } else {
        set({ isLoadingSession: false });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncProfile(session.user);
      } else {
        set({ user: null, profile: null, isLoadingSession: false });
      }
    });
  },

  loginWithFacebook: async () => {
    set({ isLoggingIn: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { 
          redirectTo: window.location.origin,
          skipBrowserRedirect: false 
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Échec de la connexion. Veuillez réessayer.");
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoadingSession: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    } finally {
      set({ user: null, profile: null, isLoadingSession: false });
    }
  },
}));
