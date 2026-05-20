import { AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import IncidentCard from '../components/IncidentCard';

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  async function loadDashboard() {
    try {
      const [incidentRes, mineRes, notificationRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/my-incidents'),
        api.get('/notifications')
      ]);

      setIncidents(incidentRes.data.data || []);
      setMyReports(mineRes.data || []);
      setNotifications(notificationRes.data || []);
    } catch {
      setError('Could not load dashboard data.');
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function markRead(id) {
    try {
      const { data } = await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map((note) => note.id === id ? data.notification : note));
    } catch {
      setError('Could not update notification.');
    }
  }

  async function openNotification(note) {
    if (!note.read) await markRead(note.id);
    navigate(note.action_url || '/app');
  }

  const stats = [
    ['My Reports', myReports.length, AlertTriangle],
    ['In Progress', myReports.filter((item) => item.status === 'In Progress').length, Clock],
    ['Resolved', myReports.filter((item) => item.status === 'Resolved').length, CheckCircle],
    ['Community Reports', incidents.length, Users]
  ];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <div className="card" key={label}><Icon className="mb-3 text-brand" /><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{value}</p></div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-xl font-bold">Recent Incidents</h2>
          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
          <div className="grid gap-4">
            {incidents.slice(0, 3).map((item) => <IncidentCard key={item.id} incident={item} />)}
            {!incidents.length && !error && <p className="text-sm text-slate-500">No incidents yet.</p>}
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Notifications</h2>
            <span className="text-sm text-slate-500">{notifications.filter((note) => !note.read).length} unread</span>
          </div>
          <div className="grid gap-3">
            {notifications.slice(0, 5).map((note) => (
              <button type="button" onClick={() => openNotification(note)} className={`card block text-left ${note.read ? 'opacity-70' : 'border-brand'}`} key={note.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{note.title}</h3>
                    <p className="text-sm text-slate-500">{note.message}</p>
                  </div>
                  {!note.read && <span className="text-xs font-semibold text-brand">Open</span>}
                </div>
              </button>
            ))}
            {!notifications.length && <p className="text-sm text-slate-500">No notifications yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
