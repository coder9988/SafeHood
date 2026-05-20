import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import api from '../api/client';
import IncidentCard from '../components/IncidentCard';

export default function MyReports() {
  const [query, setQuery] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState('');
  const filtered = incidents.filter((item) => `${item.title} ${item.location} ${item.status}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    async function loadReports() {
      try {
        const { data } = await api.get('/my-incidents');
        setIncidents(data);
      } catch {
        setError('Could not load your reports.');
      }
    }

    loadReports();
  }, []);

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold">My Reports</h2>
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input className="input pl-10" placeholder="Search reports" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>
      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => <IncidentCard key={item.id} incident={item} />)}
        {!filtered.length && !error && <p className="text-sm text-slate-500">No reports found.</p>}
      </div>
    </section>
  );
}
