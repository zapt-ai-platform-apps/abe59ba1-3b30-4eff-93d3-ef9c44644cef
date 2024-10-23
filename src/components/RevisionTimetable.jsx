import { For } from 'solid-js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

export default function RevisionTimetable(props) {
  const { exams } = props;

  const generateTimetable = () => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });
    return days.map(day => {
      const examsOnDay = exams().filter(exam => {
        const examDate = new Date(exam.examDate);
        return isSameDay(day, examDate);
      });
      return { date: day, exams: examsOnDay };
    });
  };

  const timetable = generateTimetable();

  return (
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Revision Timetable</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={timetable}>
          {(day) => (
            <div class="bg-white p-4 rounded-lg shadow-md">
              <p class="font-semibold text-lg text-purple-600 mb-2">{format(day.date, 'EEEE, MMMM do')}</p>
              <For each={day.exams}>
                {(exam) => (
                  <div class="mb-2">
                    <p class="text-gray-800">{exam.subject}</p>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}