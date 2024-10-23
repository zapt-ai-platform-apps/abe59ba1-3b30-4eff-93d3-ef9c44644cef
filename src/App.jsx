import { createSignal, onMount, createEffect } from 'solid-js';
import { supabase } from './supabaseClient';
import { Routes, Route } from '@solidjs/router';
import LoginPage from './components/LoginPage';
import AuthenticatedApp from './AuthenticatedApp';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  return (
    <Routes>
      <Route path="/" element={user() ? <AuthenticatedApp user={user} /> : <LoginPage />} />
    </Routes>
  );
}

export default App;