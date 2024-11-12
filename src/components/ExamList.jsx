import { For, Show, createSignal } from 'solid-js';
import { format } from 'date-fns';
import { supabase } from '../supabaseClient';
import ExamForm from './ExamForm';

export default function ExamList(props) {
  const { exams, loading, fetchExams } = props;

  const today = new Date();
  const upcomingExams = () => exams().filter(exam => new Date(exam.examDate) >= today);

  const [editingExam, setEditingExam] = createSignal(null);
  const [loadingDelete, setLoadingDelete] = createSignal(false);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    setLoadingDelete(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/deleteExam', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        await fetchExams();
      } else {
        console.error('Error deleting exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
    setLoadingDelete(false);
  };

  return (
    <div>
      <h2 class="text-2xl font-bold mb-4 text-white">Your Exams</h2>
      <Show when={!loading()} fallback={<p class="text-white">Loading exams...</p>}>
        <Show when={!editingExam()} fallback={
          <ExamForm
            exam={editingExam()}
            fetchExams={fetchExams}
            onCancel={() => setEditingExam(null)}
          />
        }>
          <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
            <For each={upcomingExams()}>
              {(exam) => (
                <div class="bg-gray-800 p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                  <p class="font-semibold text-lg text-white mb-1">{exam.subject}</p>
                  <p class="text-gray-300 mb-1">{format(new Date(exam.examDate), 'PPP')}</p>
                  <p class="text-gray-300 mb-1">Exam Board: {exam.examBoard}</p>
                  <p class="text-gray-300">Teacher: {exam.teacherName}</p>
                  <div class="flex space-x-2 mt-2">
                    <button
                      class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      onClick={() => setEditingExam(exam)}
                    >
                      Edit
                    </button>
                    <button
                      class={`flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 ${loadingDelete() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
                      onClick={() => handleDelete(exam.id)}
                      disabled={loadingDelete()}
                    >
                      {loadingDelete() ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}