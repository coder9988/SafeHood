import React from 'react';
import StatusBadge from './StatusBadge';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const storageBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '/storage');

function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${storageBaseUrl}/${path}`;
}

export default function IncidentCard({ incident }) {
  return (
    <article className="card">
      {incident.image && (
        <img
          src={imageUrl(incident.image)}
          alt={incident.title}
          className="mb-4 h-44 w-full rounded-lg object-cover"
        />
      )}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{incident.title}</h3>
          <p className="text-sm text-slate-500">{incident.location}</p>
        </div>
        <StatusBadge status={incident.status} />
      </div>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">{incident.description}</p>
      {incident.user && <p className="mb-3 text-xs text-slate-500">Reported by {incident.user.name}</p>}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">{incident.category}</span>
        <span className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">{incident.severity}</span>
      </div>
    </article>
  );
}
