import { createSignal, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import PreferencesForm from './components/PreferencesForm';
import HomePage from './components/HomePage';

export default function AuthenticatedApp(props) {
  const { user } = props;

  const [preferences, setPreferences] = createSignal(null);
  const [loadingPreferences, setLoadingPreferences] = createSignal(true);

  const fetchPreferences = async () => {
    setLoadingPreferences(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/getPreferences', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      } else {
        console.error('Error fetching preferences');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
    setLoadingPreferences(false);
  };

  createEffect(() => {
    fetchPreferences();
  });

  return (
    <Show
      when={!loadingPreferences()}
      fallback={
        <div class="flex items-center justify-center min-h-screen bg-black text-white">
          <p>Loading...</p>
        </div>
      }
    >
      {preferences() ? (
        <HomePage user={user} preferences={preferences} />
      ) : (
        <PreferencesForm fetchPreferences={fetchPreferences} />
      )}
    </Show>
  );
}