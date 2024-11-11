import { createMemo } from 'solid-js';
import { For } from 'solid-js';
import {
  format,
  eachDayOfInterval,
  isSameDay,
  isAfter,
  isBefore,
  parseISO,
  addDays,
  subDays,
} from 'date-fns';

export default function RevisionTimetable(props) {
  const { exams, preferences } = props;

  const timetable = createMemo(() => {
    const today = new Date();
    const startDate = preferences()?.startDate ? parseISO(preferences().startDate) : today;

    const revisionStartDate = isAfter(startDate, today) ? startDate : today;

    // Filter out exams that have already passed
    const futureExams = exams().filter((exam) => {
      const examDate = new Date(exam.examDate);
      return isAfter(examDate, revisionStartDate) || isSameDay(examDate, revisionStartDate);
    });

    if (futureExams.length === 0) {
      return [];
    }

    // Collect all dates from revisionStartDate to the latest exam date
    const latestExamDate = futureExams.reduce((latest, exam) => {
      const examDate = new Date(exam.examDate);
      return examDate > latest ? examDate : latest;
    }, revisionStartDate);

    const days = eachDayOfInterval({ start: revisionStartDate, end: latestExamDate });

    // Create a map of exam dates to exams
    const examDateMap = {};
    futureExams.forEach((exam) => {
      const examDateStr = new Date(exam.examDate).toDateString();
      if (!examDateMap[examDateStr]) {
        examDateMap[examDateStr] = [];
      }
      examDateMap[examDateStr].push(exam);
    });

    // Collect all available sessions
    const availableSessions = [];

    days.forEach((day) => {
      const dayKey = day.toDateString();

      // Skip if the day is an exam day
      if (examDateMap[dayKey]) {
        return;
      }

      const dayIndex = day.getDay(); // 0 (Sunday) to 6 (Saturday)
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

      const dayAvailability = preferences().availability[dayName];

      for (let hour = 8; hour < 20; hour++) {
        if (dayAvailability[hour]) {
          availableSessions.push({ date: day, time: hour });
        }
      }
    });

    // Sort available sessions by date and time
    availableSessions.sort((a, b) => a.date - b.date || a.time - b.time);

    // Initialize subject session counts
    const subjectSessionCounts = {};
    futureExams.forEach((exam) => {
      subjectSessionCounts[exam.subject] = 0;
    });

    const assignedSessions = [];
    const assignedSessionIds = new Set();

    // Map sessions by date
    const sessionsByDate = new Map();
    availableSessions.forEach((session) => {
      const dateStr = session.date.toDateString();
      if (!sessionsByDate.has(dateStr)) {
        sessionsByDate.set(dateStr, []);
      }
      sessionsByDate.get(dateStr).push(session);
    });

    // Assign at least one session to exam subjects on the day before the exam
    futureExams.forEach((exam) => {
      const examDate = new Date(exam.examDate);
      const previousDay = subDays(examDate, 1);
      if (isBefore(previousDay, revisionStartDate)) return;

      const dateStr = previousDay.toDateString();

      if (sessionsByDate.has(dateStr)) {
        const sessions = sessionsByDate.get(dateStr);
        for (const session of sessions) {
          const sessionId = `${session.date.toISOString()}_${session.time}`;

          // If session already assigned, skip
          if (assignedSessionIds.has(sessionId)) {
            continue;
          }

          // If we have already assigned a session to this subject on this date, skip
          if (assignedSessions.some(s => s.date.getTime() === session.date.getTime() && s.subject === exam.subject)) {
            continue;
          }

          assignedSessions.push({
            ...session,
            subject: exam.subject,
          });
          assignedSessionIds.add(sessionId);
          subjectSessionCounts[exam.subject] = (subjectSessionCounts[exam.subject] || 0) + 1;

          // We only need to assign at least one session for this subject on previous day
          break;
        }
      }
    });

    // Collect unassigned sessions
    const unassignedSessions = availableSessions.filter(session => {
      const sessionId = `${session.date.toISOString()}_${session.time}`;
      return !assignedSessionIds.has(sessionId);
    });

    // Assign remaining sessions equally among subjects
    unassignedSessions.forEach((session) => {
      const sessionId = `${session.date.toISOString()}_${session.time}`;

      // Determine valid subjects for this session
      const validSubjects = futureExams
        .filter((exam) => {
          const examDate = new Date(exam.examDate);

          // Exclude this subject if the session is on or after its exam date
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
        if ((subjectSessionCounts[subject] || 0) < minCount) {
          minCount = subjectSessionCounts[subject] || 0;
          selectedSubject = subject;
        }
      });

      if (selectedSubject) {
        assignedSessions.push({
          ...session,
          subject: selectedSubject,
        });
        assignedSessionIds.add(sessionId);
        subjectSessionCounts[selectedSubject] = (subjectSessionCounts[selectedSubject] || 0) + 1;
      }
    });

    // Group sessions by date and time
    const timetableMap = {};

    assignedSessions.forEach((session) => {
      const dateKey = session.date.toDateString();
      if (!timetableMap[dateKey]) {
        timetableMap[dateKey] = { date: session.date, sessions: {}, exams: [], isExamDay: false };
      }
      timetableMap[dateKey].sessions[session.time] = session;
    });

    // Add exams on that date
    days.forEach((day) => {
      const dateKey = day.toDateString();
      if (!timetableMap[dateKey]) {
        timetableMap[dateKey] = { date: day, sessions: {}, exams: [], isExamDay: false };
      }
      const examsOnDay = futureExams.filter((exam) => {
        const examDate = new Date(exam.examDate);
        return isSameDay(day, examDate);
      });
      timetableMap[dateKey].exams = examsOnDay;
      timetableMap[dateKey].isExamDay = examsOnDay.length > 0;
    });

    // Convert timetableMap to an array sorted by date
    const timetableArray = Object.values(timetableMap).sort((a, b) => a.date - b.date);

    return timetableArray;
  });

  return (
    <div class="mt-8">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Revision Timetable</h2>
      <For each={timetable()}>
        {(day) => (
          <div class={`mb-6 ${day.isExamDay ? 'border-2 border-red-500 rounded-lg' : ''}`}>
            <h3 class="text-xl font-semibold mb-2 text-purple-600">
              {format(day.date, 'EEEE, MMMM do')}
            </h3>
            <For each={day.exams}>
              {(exam) => (
                <div class="mt-2">
                  <p class="text-red-600 font-semibold">Exam: {exam.subject}</p>
                </div>
              )}
            </For>
            <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 mt-2">
              <For each={Array.from({ length: 12 }, (_, i) => 8 + i)}>
                {(hour) => {
                  const session = day.sessions[hour];
                  const isAvailable = preferences().availability[format(day.date, 'cccc').toLowerCase()][hour];
                  return (
                    <div class={`p-2 rounded-lg text-center ${session ? 'bg-purple-200' : isAvailable ? 'bg-green-100' : 'bg-gray-200'}`}>
                      <p class="text-sm">{hour}:00</p>
                      {session && <p class="text-xs">{session.subject}</p>}
                    </div>
                  );
                }}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}