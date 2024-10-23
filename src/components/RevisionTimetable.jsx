import { For } from 'solid-js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';

export default function RevisionTimetable(props) {
  const { exams, preferences } = props;

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
      const isExamDay = examsOnDay.length > 0;

      const dayIndex = getDay(day);
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayIndex];
      const sessionPreference = preferences()[dayName];

      return { date: day, exams: examsOnDay, isExamDay, sessionPreference };
    });
  };

  const timetable = generateTimetable();

  return (
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Revision Timetable</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={timetable}>
          {(day) => (
            <div
              class={`bg-white p-4 rounded-lg shadow-md ${day.isExamDay ? 'border-2 border-red-500' : ''}`}
            >
              <p class="font-semibold text-lg text-purple-600 mb-2">{format(day.date, 'EEEE, MMMM do')}</p>
              {day.sessionPreference !== 'none' ? (
                <p class="text-gray-800">
                  Revision Session: {day.sessionPreference.charAt(0).toUpperCase() + day.sessionPreference.slice(1)}
                </p>
              ) : (
                <p class="text-gray-800">No revision session scheduled.</p>
              )}
              <For each={day.exams}>
                {(exam) => (
                  <div class="mt-2">
                    <p class="text-gray-800">Exam: {exam.subject}</p>
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