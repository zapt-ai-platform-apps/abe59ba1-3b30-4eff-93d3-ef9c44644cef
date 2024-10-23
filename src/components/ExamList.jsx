import { For, Show } from 'solid-js';
import { format } from 'date-fns';

export default function ExamList(props) {
  const { exams, loading } = props;

  return (
    <div>
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Exams</h2>
      <Show when={!loading()} fallback={<p>Loading exams...</p>}>
        <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
          <For each={exams()}>
            {(exam) => (
              <div class="bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
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
  );
}