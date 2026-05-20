import { MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import api from '../api/client';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const storageBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '/storage');

function imageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${storageBaseUrl}/${path}`;
}

export default function CommunityFeed() {
  const [announcements, setAnnouncements] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [error, setError] = useState('');

  async function loadFeed() {
    try {
      const [incidentRes, announcementRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/announcements')
      ]);

      setIncidents(incidentRes.data.data || []);
      setAnnouncements(announcementRes.data || []);
    } catch {
      setError('Could not load the community feed.');
    }
  }

  useEffect(() => {
    loadFeed();
  }, []);

  async function addComment(e, incidentId) {
    e.preventDefault();
    const message = (commentText[incidentId] || '').trim();

    if (!message) return;

    try {
      await api.post(`/incidents/${incidentId}/comments`, { message });
      setCommentText({ ...commentText, [incidentId]: '' });
      await loadFeed();
    } catch {
      setError('Could not post your comment.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-bold">Incident Updates</h2>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <div className="grid gap-4">
          {incidents.map((item) => (
            <article className="card" key={item.id}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.status} at {item.location}</p>
              {item.image && <img src={imageUrl(item.image)} alt={item.title} className="mt-3 h-56 w-full rounded-lg object-cover" />}
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><MessageCircle size={16} /> Comments</div>
                {(item.comments || []).length ? item.comments.map((comment) => <p className="text-sm text-slate-500" key={comment.id}>{comment.user.name}: {comment.message}</p>) : <p className="text-sm text-slate-500">No comments yet.</p>}
                <form onSubmit={(e) => addComment(e, item.id)} className="mt-3 flex gap-2">
                  <input className="input" placeholder="Write a comment" value={commentText[item.id] || ''} onChange={(e) => setCommentText({ ...commentText, [item.id]: e.target.value })} />
                  <button className="btn-primary">Post</button>
                </form>
              </div>
            </article>
          ))}
          {!incidents.length && !error && <p className="text-sm text-slate-500">No incident updates yet.</p>}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold">Announcements</h2>
        <div className="grid gap-3">
          {announcements.map((item) => <article className="card" key={item.id}><h3 className="font-semibold">{item.title}</h3><p className="mt-2 text-sm text-slate-500">{item.message}</p></article>)}
        </div>
      </section>
    </div>
  );
}
