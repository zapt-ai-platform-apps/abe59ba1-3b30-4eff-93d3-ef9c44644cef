import { createMemo } from 'solid-js';
import { For } from 'solid-js';
import { format, eachDayOfInterval, isSameDay, getDay, isAfter } from 'date-fns';

export default function RevisionTimetable(props) {
  const { exams, preferences } = props;

  const timetable = createMemo(() => {
    const today = new Date();

    // Filter out exams that have already passed
    const futureExams = exams().filter((exam) => {
      const examDate = new Date(exam.examDate);
      return isAfter(examDate, today) || isSameDay(examDate, today);
    });

    if (futureExams.length === 0) {
      return [];
    }

    // Collect all dates from today to the latest exam date
    const latestExamDate = futureExams.reduce((latest, exam) => {
      const examDate = new Date(exam.examDate);
      return examDate > latest ? examDate : latest;
    }, today);

    const days = eachDayOfInterval({ start: today, end: latestExamDate });

    // Create a Set of exam dates for quick lookup
    const examDatesSet = new Set(futureExams.map((exam) => new Date(exam.examDate).toDateString()));

    // Collect all available sessions
    const availableSessions = [];

    days.forEach((day) => {
      const dayKey = day.toDateString();

      // Skip if the day is an exam day
      if (examDatesSet.has(dayKey)) {
        return;
      }

      const dayIndex = getDay(day); // 0 (Sunday) to 6 (Saturday)
      const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const dayName = dayNames[dayIndex];

      const sessionPreference = preferences()[dayName];

      if (sessionPreference === 'morning' || sessionPreference === 'both') {
        availableSessions.push({ date: day, time: 'Morning' });
      }

      if (sessionPreference === 'afternoon' || sessionPreference === 'both') {
        availableSessions.push({ date: day, time: 'Afternoon' });
      }
    });

    // Sort available sessions by date
    availableSessions.sort((a, b) => a.date - b.date);

    // Initialize subject session counts
    const subjectSessionCounts = {};
    futureExams.forEach((exam) => {
      subjectSessionCounts[exam.subject] = 0;
    });

    const assignedSessions = [];
    const assignedSessionIds = new Set();

    // Assign regular sessions
    availableSessions.forEach((session) => {
      const sessionId = `${session.date.toISOString()}_${session.time}`;
      if (assignedSessionIds.has(sessionId)) {
        // Session already assigned
        return;
      }

      // Determine valid subjects for this session
      const validSubjects = futureExams
        .filter((exam) => {
          const examDate = new Date(exam.examDate);

          // Exclude this subject if the session is on or after the exam date
          if (isAfter(session.date, examDate) || isSameDay(session.date, examDate)) {
            return false;
          }
          return true;
        })
        .map((exam) => exam.subject);

      if (validSubjects.length === 0) {
        return;
      }

      // Find subject with minimal session count
      let minCount = Infinity;
      let selectedSubject = null;
      validSubjects.forEach((subject) => {
        if (subjectSessionCounts[subject] < minCount) {
          minCount = subjectSessionCounts[subject];
          selectedSubject = subject;
        }
      });

      if (selectedSubject) {
        assignedSessions.push({
          ...session,
          subject: selectedSubject,
        });
        assignedSessionIds.add(sessionId);
        subjectSessionCounts[selectedSubject]++;
      }
    });

    // Group sessions by date
    const timetableMap = {};

    assignedSessions.forEach((session) => {
      const dateKey = session.date.toDateString();
      if (!timetableMap[dateKey]) {
        timetableMap[dateKey] = { date: session.date, sessions: [], exams: [], isExamDay: false };
      }
      timetableMap[dateKey].sessions.push(session);
    });

    // Add exams on that date
    days.forEach((day) => {
      const dateKey = day.toDateString();
      if (!timetableMap[dateKey]) {
        timetableMap[dateKey] = { date: day, sessions: [], exams: [], isExamDay: false };
      }
      const examsOnDay = futureExams.filter((exam) => {
        const examDate = new Date(exam.examDate);
        return isSameDay(day, examDate);
      });
      timetableMap[dateKey].exams = examsOnDay;
      timetableMap[dateKey].isExamDay = examsOnDay.length > 0;
    });

    // Convert timetableMap to an array sorted by date
    const timetableArray = Object.values(timetableMap).sort(
      (a, b) => a.date - b.date
    );

    return timetableArray;
  });

  return (
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Revision Timetable</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <For each={timetable()}>
          {(day) => (
            <div
              class={`bg-white p-4 rounded-lg shadow-md ${
                day.isExamDay ? 'border-2 border-red-500' : ''
              }`}
            >
              <p class="font-semibold text-lg text-purple-600 mb-2">
                {format(day.date, 'EEEE, MMMM do')}
              </p>
              <For each={day.exams}>
                {(exam) => (
                  <div class="mt-2">
                    <p class="text-red-600 font-semibold">
                      Exam: {exam.subject}
                    </p>
                  </div>
                )}
              </For>
              {day.sessions.length > 0 ? (
                <For each={day.sessions}>
                  {(session) => (
                    <p class="text-gray-800">
                      {session.time}: {session.subject}
                    </p>
                  )}
                </For>
              ) : (
                <p class="text-gray-800">No revision session scheduled.</p>
              )}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}