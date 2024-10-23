import { createSignal, createEffect, Show } from 'solid-js';
import { supabase } from '../supabaseClient';

export default function ExamForm(props) {
  const { fetchExams, exam, onCancel } = props;

  const [examData, setExamData] = createSignal({
    id: exam?.id || null,
    subject: exam?.subject || '',
    examDate: exam?.examDate ? exam.examDate.split('T')[0] : '',
    examBoard: exam?.examBoard || '',
    teacherName: exam?.teacherName || ''
  });

  const [loading, setLoading] = createSignal(false);

  const saveExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      if (examData().id) {
        // Update exam
        const response = await fetch('/api/updateExam', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(examData()),
        });
        if (response.ok) {
          await fetchExams();
          onCancel();
        } else {
          console.error('Error updating exam');
        }
      } else {
        // Create new exam
        const response = await fetch('/api/saveExam', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(examData()),
        });
        if (response.ok) {
          await fetchExams();
          setExamData({
            subject: '',
            examDate: '',
            examBoard: '',
            teacherName: ''
          });
        } else {
          console.error('Error saving exam');
        }
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 class="text-2xl font-bold mb-4 text-purple-600">
        {examData().id ? 'Edit Exam' : 'Add New Exam'}
      </h2>
      <form onSubmit={saveExam} class="space-y-4">
        <input
          type="text"
          placeholder="Subject"
          value={examData().subject}
          onInput={(e) => setExamData({ ...examData(), subject: e.target.value })}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="date"
          placeholder="Exam Date"
          value={examData().examDate}
          onInput={(e) => setExamData({ ...examData(), examDate: e.target.value })}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="text"
          placeholder="Examination Board"
          value={examData().examBoard}
          onInput={(e) => setExamData({ ...examData(), examBoard: e.target.value })}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <input
          type="text"
          placeholder="Teacher's Name"
          value={examData().teacherName}
          onInput={(e) => setExamData({ ...examData(), teacherName: e.target.value })}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          required
        />
        <div class="flex space-x-4">
          <button
            type="submit"
            class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
            disabled={loading()}
          >
            {loading() ? 'Saving...' : examData().id ? 'Update Exam' : 'Save Exam'}
          </button>
          <Show when={examData().id}>
            <button
              type="button"
              class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={onCancel}
            >
              Cancel
            </button>
          </Show>
        </div>
      </form>
    </div>
  );
}