import React, { useState } from 'react';
import api from '../api/client';

export default function ReportIncident() {
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: 'Suspicious Activity', severity: 'Low', location: '', anonymous: false });

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function submit(e) {
    e.preventDefault();
    const body = new FormData(e.currentTarget);
    body.set('anonymous', form.anonymous ? 1 : 0);

    try {
      await api.post('/incidents', body);
      setMessage('Incident reported successfully.');
      setPreview('');
      setForm({ title: '', description: '', category: 'Suspicious Activity', severity: 'Low', location: '', anonymous: false });
      e.currentTarget.reset();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not submit this report.');
    }
  }

  function previewImage(file) {
    if (!file) {
      setPreview('');
      return;
    }

    setPreview(URL.createObjectURL(file));
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-3xl">
      <h2 className="mb-5 text-xl font-bold">Report Incident</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <input name="title" className="input md:col-span-2" placeholder="Title" required value={form.title} onChange={(e) => update('title', e.target.value)} />
        <select name="category" className="input" value={form.category} onChange={(e) => update('category', e.target.value)}>
          {['Suspicious Activity', 'Infrastructure', 'Hazard', 'Noise', 'Other'].map((x) => <option key={x}>{x}</option>)}
        </select>
        <select name="severity" className="input" value={form.severity} onChange={(e) => update('severity', e.target.value)}>
          {['Low', 'Medium', 'High'].map((x) => <option key={x}>{x}</option>)}
        </select>
        <input name="location" className="input md:col-span-2" placeholder="Location" required value={form.location} onChange={(e) => update('location', e.target.value)} />
        <textarea name="description" className="input min-h-32 md:col-span-2" placeholder="Description" required value={form.description} onChange={(e) => update('description', e.target.value)} />
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold">Evidence photo</label>
          <input name="image" type="file" accept="image/*" className="input" onChange={(e) => previewImage(e.target.files?.[0])} />
          <p className="mt-2 text-xs text-slate-500">Optional. Upload a clear photo if it helps admins verify the incident.</p>
          {preview && <img src={preview} alt="Selected evidence preview" className="mt-3 h-44 w-full rounded-lg object-cover" />}
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.anonymous} onChange={(e) => update('anonymous', e.target.checked)} /> Report anonymously
      </label>
      <button className="btn-primary mt-5">Submit Report</button>
      {message && <p className="mt-4 text-sm text-brand">{message}</p>}
    </form>
  );
}
