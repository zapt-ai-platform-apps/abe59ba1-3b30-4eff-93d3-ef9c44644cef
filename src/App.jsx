import { createSignal, onMount, createEffect } from 'solid-js';
import { supabase } from './supabaseClient';
import { Routes, Route } from '@solidjs/router';
import LoginPage from './components/LoginPage';
import AuthenticatedApp from './AuthenticatedApp';

function App() {
  const [user, setUser] = createSignal(null);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  return (
    <Routes>
      <Route path="/" element={user() ? <AuthenticatedApp user={user} /> : <LoginPage />} />
    </Routes>
  );
}

export default App;