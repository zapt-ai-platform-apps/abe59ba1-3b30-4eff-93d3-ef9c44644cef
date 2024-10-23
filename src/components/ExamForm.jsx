import { createSignal } from 'solid-js';
import { supabase } from '../supabaseClient';

export default function ExamForm(props) {
  const { fetchExams } = props;

  const [newExam, setNewExam] = createSignal({
    subject: '',
    examDate: '',
    examBoard: '',
    teacherName: ''
  });

  const [loading, setLoading] = createSignal(false);

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
        await fetchExams();
        setNewExam({
          subject: '',
          examDate: '',
          examBoard: '',
          teacherName: ''
        });
      } else {
        console.error('Error saving exam');
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
    setLoading(false);
  };

  return (
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
          class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
          disabled={loading()}
        >
          {loading() ? 'Saving...' : 'Save Exam'}
        </button>
      </form>
    </div>
  );
}