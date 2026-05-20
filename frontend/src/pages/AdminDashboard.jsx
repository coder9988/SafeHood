import React, { useEffect, useState } from 'react';
import api from '../api/client';
import StatusBadge from '../components/StatusBadge';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const storageBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '/storage');

function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${storageBaseUrl}/${path}`;
}

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ total_incidents: 0, total_users: 0, pending_reports: 0 });
  const [announcement, setAnnouncement] = useState({ title: '', message: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [query, setQuery] = useState('');

  async function loadAdmin() {
    try {
      const [statsRes, incidentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/incidents')
      ]);

      setStats(statsRes.data);
      setIncidents(incidentsRes.data);
    } catch {
      setError('Admin data is available only to admin users.');
    }
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  async function changeStatus(id, status) {
    try {
      const { data } = await api.patch(`/admin/incidents/${id}/status`, { status });
      setIncidents(incidents.map((item) => item.id === id ? { ...item, status: data.incident.status } : item));
      setStats({ ...stats, pending_reports: incidents.filter((item) => (item.id === id ? status : item.status) === 'Reported').length });
      setMessage('Incident status updated.');
    } catch {
      setError('Could not update status.');
    }
  }

  async function publishAnnouncement(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await api.post('/announcements', announcement);
      setAnnouncement({ title: '', message: '' });
      setMessage('Announcement published to the community feed.');
    } catch {
      setError('Could not publish announcement.');
    }
  }

  const filteredIncidents = incidents.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const text = `${item.title} ${item.category} ${item.location} ${item.user?.name || ''}`.toLowerCase();

    return matchesStatus && text.includes(query.toLowerCase());
  });

  const statCards = [
    ['Total Incidents', stats.total_incidents],
    ['Total Users', stats.total_users],
    ['Pending Reports', stats.pending_reports]
  ];

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map(([label, value]) => <div className="card" key={label}><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-bold">{value}</p></div>)}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {message && <p className="text-sm text-brand">{message}</p>}
      <form onSubmit={publishAnnouncement} className="card grid gap-4">
        <h2 className="text-xl font-bold">Publish Announcement</h2>
        <input
          className="input"
          placeholder="Announcement title"
          required
          value={announcement.title}
          onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
        />
        <textarea
          className="input min-h-28"
          placeholder="Message for residents"
          required
          value={announcement.message}
          onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
        />
        <button className="btn-primary w-fit">Publish</button>
      </form>
      <div className="card overflow-x-auto">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold">Incident Management</h2>
          <div className="flex flex-col gap-3 md:flex-row">
            <input className="input md:w-72" placeholder="Search incidents" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="input md:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {['All', 'Reported', 'In Progress', 'Resolved'].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-slate-500">
            <tr><th className="py-3">Title</th><th>Reporter</th><th>Category</th><th>Severity</th><th>Location</th><th>Evidence</th><th>Status</th><th>Change Status</th></tr>
          </thead>
          <tbody>
            {filteredIncidents.map((item) => (
              <tr className="border-t border-slate-200 dark:border-slate-800" key={item.id}>
                <td className="py-3 font-medium">{item.title}</td>
                <td>{item.user?.name || 'Anonymous'}</td>
                <td>{item.category}</td>
                <td>{item.severity}</td>
                <td>{item.location}</td>
                <td>
                  {item.image ? <a href={imageUrl(item.image)} target="_blank" className="font-semibold text-brand" rel="noreferrer">View</a> : <span className="text-slate-400">None</span>}
                </td>
                <td><StatusBadge status={item.status} /></td>
                <td>
                  <select className="input" value={item.status} onChange={(e) => changeStatus(item.id, e.target.value)}>
                    {['Reported', 'In Progress', 'Resolved'].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filteredIncidents.length && <p className="py-4 text-sm text-slate-500">No incidents match your filters.</p>}
      </div>
    </section>
  );
}
