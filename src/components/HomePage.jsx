import { createSignal, createEffect } from 'solid-js';
import { supabase } from '../supabaseClient';
import ExamForm from './ExamForm';
import ExamList from './ExamList';
import RevisionTimetable from './RevisionTimetable';

export default function HomePage(props) {
  const { user } = props;

  const [exams, setExams] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const fetchExams = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/getExams', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setExams(data);
    } else {
      console.error('Error fetching exams:', response.statusText);
    }
    setLoading(false);
  };

  createEffect(() => {
    fetchExams();
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600">UpGrade</h1>
          <button
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ExamForm fetchExams={fetchExams} />
          <ExamList exams={exams} loading={loading} />
        </div>

        <RevisionTimetable exams={exams} />
      </div>
    </div>
  );
}