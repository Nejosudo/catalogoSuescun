'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings?key=registration_enabled');
      const data = await res.json();
      setRegistrationEnabled(data.value === 'true');
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    setSaving(true);
    const newValue = !registrationEnabled;
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'registration_enabled', value: String(newValue) }),
      });
      setRegistrationEnabled(newValue);
    } catch (error) {
      console.error('Failed to update setting', error);
      alert('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">User Registration</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Control whether new users can register accounts on the platform.</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleToggle}
              disabled={saving}
              className={`${
                registrationEnabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              role="switch"
              aria-checked={registrationEnabled}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${
                  registrationEnabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
            <span className="ml-3 text-sm font-medium text-gray-900">
              {registrationEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
