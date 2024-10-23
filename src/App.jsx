import { createSignal, onMount } from 'solid-js';
import { supabase } from './supabaseClient';
import { Routes, Route } from '@solidjs/router';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = createSignal(null);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    }
  };

  onMount(checkUserSignedIn);

  supabase.auth.onAuthStateChange((_, session) => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  });

  return (
    <Routes>
      <Route path="/" element={user() ? <HomePage user={user} /> : <LoginPage />} />
    </Routes>
  );
}

export default App;