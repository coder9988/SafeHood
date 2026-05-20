import React from 'react';

const colors = {
  Reported: 'bg-amber-100 text-amber-700 dark:bg-amber-950',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-950',
  Resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950'
};

export default function StatusBadge({ status }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[status] || colors.Reported}`}>{status}</span>;
}
