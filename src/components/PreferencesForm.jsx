import { createSignal, For } from 'solid-js';
import { supabase } from '../supabaseClient';

export default function PreferencesForm(props) {
  const { fetchPreferences, preferences: existingPreferences = null, onCancel = null } = props;

  const [preferences, setPreferences] = createSignal({
    monday: existingPreferences?.monday || 'none',
    tuesday: existingPreferences?.tuesday || 'none',
    wednesday: existingPreferences?.wednesday || 'none',
    thursday: existingPreferences?.thursday || 'none',
    friday: existingPreferences?.friday || 'none',
    saturday: existingPreferences?.saturday || 'none',
    sunday: existingPreferences?.sunday || 'none',
    sessionDuration: existingPreferences?.sessionDuration || 30,
    startDate: existingPreferences?.startDate ? existingPreferences.startDate.split('T')[0] : '',
  });

  const [loading, setLoading] = createSignal(false);

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

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="h-full max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-center text-purple-600">Set Your Revision Preferences</h1>
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <For each={daysOfWeek}>
              {(day) => (
                <div class="flex flex-col">
                  <label class="font-semibold capitalize mb-2">{day}</label>
                  <select
                    value={preferences()[day]}
                    onInput={(e) => setPreferences({ ...preferences(), [day]: e.target.value })}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 box-border cursor-pointer"
                  >
                    <option value="none">None</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              )}
            </For>
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
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 box-border"
            />
          </div>
          <div>
            <label class="font-semibold mb-2 block">Revision Start Date</label>
            <input
              type="date"
              value={preferences().startDate}
              onInput={(e) => setPreferences({ ...preferences(), startDate: e.target.value })}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 box-border"
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