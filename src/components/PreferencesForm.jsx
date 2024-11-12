import { createSignal } from 'solid-js';
import { supabase } from '../supabaseClient';

export default function PreferencesForm(props) {
  const { fetchPreferences, preferences: existingPreferences = null, onCancel = null } = props;

  const initialAvailability = () => {
    if (existingPreferences?.availability) {
      return existingPreferences.availability;
    } else {
      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const hours = Array.from({ length: 12 }, (_, i) => 8 + i);
      const availability = {};
      daysOfWeek.forEach(day => {
        availability[day] = {};
        hours.forEach(hour => {
          availability[day][hour] = false;
        });
      });
      return availability;
    }
  };

  const [preferences, setPreferences] = createSignal({
    availability: initialAvailability(),
    sessionDuration: existingPreferences?.sessionDuration || 30,
    startDate: existingPreferences?.startDate ? existingPreferences.startDate.split('T')[0] : '',
  });

  const [loading, setLoading] = createSignal(false);

  const handleHourToggle = (day, hour) => {
    setPreferences(prev => {
      const updatedAvailability = { ...prev.availability };
      updatedAvailability[day][hour] = !updatedAvailability[day][hour];
      return { ...prev, availability: updatedAvailability };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/savePreferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences()),
      });
      if (response.ok) {
        await fetchPreferences();
        if (onCancel) {
          onCancel();
        }
      } else {
        console.error('Error saving preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
    setLoading(false);
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i);

  return (
    <div class="min-h-screen bg-black p-4 text-white">
      <div class="h-full max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-center text-purple-600">Set Your Revision Preferences</h1>
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="overflow-x-auto">
            <table class="min-w-full bg-gray-800 rounded-lg shadow-md">
              <thead>
                <tr>
                  <th class="px-4 py-2 text-left"></th>
                  <For each={hours}>
                    {(hour) => (
                      <th class="px-2 py-2 text-center text-sm">{hour}:00</th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={daysOfWeek}>
                  {(day) => (
                    <tr>
                      <td class="px-4 py-2 font-semibold capitalize">{day}</td>
                      <For each={hours}>
                        {(hour) => (
                          <td class="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={preferences().availability[day][hour]}
                              onInput={() => handleHourToggle(day, hour)}
                              class="cursor-pointer"
                            />
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <div>
            <label class="font-semibold mb-2 block">Session Duration (minutes)</label>
            <input
              type="number"
              min="30"
              max="120"
              step="15"
              value={preferences().sessionDuration}
              onInput={(e) => setPreferences({ ...preferences(), sessionDuration: e.target.value })}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 box-border text-black"
            />
          </div>
          <div>
            <label class="font-semibold mb-2 block">Revision Start Date</label>
            <input
              type="date"
              value={preferences().startDate}
              onInput={(e) => setPreferences({ ...preferences(), startDate: e.target.value })}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 box-border text-black"
              required
            />
          </div>
          <div class="flex space-x-4">
            <button
              type="submit"
              class={`flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
              disabled={loading()}
            >
              {loading() ? 'Saving...' : 'Save Preferences'}
            </button>
            {onCancel && (
              <button
                type="button"
                class="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}