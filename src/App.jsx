import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subDays } from 'date-fns';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [exams, setExams] = createSignal([]);
  const [newExam, setNewExam] = createSignal({
    subject: '',
    examDate: '',
    examBoard: '',
    teacherName: ''
  });
  const [loading, setLoading] = createSignal(false);
  const [timetable, setTimetable] = createSignal([]);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

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
      generateRevisionTimetable(data);
    } else {
      console.error('Error fetching exams:', response.statusText);
    }
    setLoading(false);
  };

  const saveExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/saveExam', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExam()),
      });
      if (response.ok) {
        const savedExam = await response.json();
        setExams([...exams(), savedExam]);
        setNewExam({
          subject: '',
          examDate: '',
          examBoard: '',
          teacherName: ''
        });
        generateRevisionTimetable([...exams(), savedExam]);
      } else {
        console.error('Error saving exam');
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
    setLoading(false);
  };

  createEffect(() => {
    if (!user()) return;
    fetchExams();
  });

  const generateRevisionTimetable = (examsData) => {
    const timetableData = {};
    examsData.forEach((exam) => {
      const examDate = new Date(exam.examDate);
      for (let i = 7; i >= 1; i--) {
        const revisionDate = subDays(examDate, i);
        const dateKey = format(revisionDate, 'yyyy-MM-dd');
        if (!timetableData[dateKey]) {
          timetableData[dateKey] = [];
        }
        timetableData[dateKey].push({
          type: 'revision',
          subject: exam.subject
        });
      }
      const examDateKey = format(examDate, 'yyyy-MM-dd');
      if (!timetableData[examDateKey]) {
        timetableData[examDateKey] = [];
      }
      timetableData[examDateKey].push({
        type: 'exam',
        subject: exam.subject
      });
    });
    setTimetable(timetableData);
  };

  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
                view="magic_link"
              />
            </div>
          </div>
        }
      >
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
            <div>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Add New Exam</h2>
              <form onSubmit={saveExam} class="space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={newExam().subject}
                  onInput={(e) => setNewExam({ ...newExam(), subject: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
                <input
                  type="date"
                  placeholder="Exam Date"
                  value={newExam().examDate}
                  onInput={(e) => setNewExam({ ...newExam(), examDate: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
                <input
                  type="text"
                  placeholder="Examination Board"
                  value={newExam().examBoard}
                  onInput={(e) => setNewExam({ ...newExam(), examBoard: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
                <input
                  type="text"
                  placeholder="Teacher's Name"
                  value={newExam().teacherName}
                  onInput={(e) => setNewExam({ ...newExam(), teacherName: e.target.value })}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  required
                />
                <button
                  type="submit"
                  class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading()}
                >
                  <Show when={loading()} fallback="Save Exam">
                    Saving...
                  </Show>
                </button>
              </form>
            </div>

            <div>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Exams</h2>
              <Show when={!loading()} fallback={<p>Loading exams...</p>}>
                <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                  <For each={exams()}>
                    {(exam) => (
                      <div class="bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                        <p class="font-semibold text-lg text-purple-600 mb-1">{exam.subject}</p>
                        <p class="text-gray-700 mb-1">{format(new Date(exam.examDate), 'PPP')}</p>
                        <p class="text-gray-700 mb-1">Exam Board: {exam.examBoard}</p>
                        <p class="text-gray-700">Teacher: {exam.teacherName}</p>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </div>

          <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Revision Timetable</h2>
            <div class="grid grid-cols-7 gap-2">
              <For each={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}>
                {(day) => (
                  <div class="text-center font-semibold">{day}</div>
                )}
              </For>
              <For each={daysInMonth}>
                {(day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayEvents = timetable()[dateKey] || [];
                  return (
                    <div class="p-2 border border-gray-300 rounded-lg h-24 flex flex-col">
                      <div class="text-sm font-semibold mb-1">{format(day, 'd')}</div>
                      <For each={dayEvents}>
                        {(event) => (
                          <div
                            class={`text-xs rounded px-1 mb-1 ${
                              event.type === 'exam' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                            }`}
                          >
                            {event.type === 'exam' ? 'Exam: ' : 'Revise: '}
                            {event.subject}
                          </div>
                        )}
                      </For>
                    </div>
                  );
                }}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;