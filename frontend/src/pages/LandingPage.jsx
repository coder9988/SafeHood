import { ArrowRight, MessageSquare, ShieldCheck, Siren } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="text-brand" /> SafeHood</div>
        <div className="flex items-center gap-3"><ThemeToggle /><Link to="/login" className="btn-primary">Login</Link></div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="mb-3 font-semibold text-brand">Neighborhood Safety & Incident Reporting System</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Report issues, track action, and keep your community safer.</h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">A simple full stack college project where residents can report incidents, view updates, and communicate with admins.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">Get Started <ArrowRight size={18} /></Link>
            <a href="#features" className="btn-light">View Features</a>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <Siren className="text-red-500" />
            <div><h3 className="font-semibold">High Severity Alert</h3><p className="text-sm text-slate-500">Suspicious activity at Block C</p></div>
          </div>
          {['Reported by resident', 'Admin reviewing', 'Community notified'].map((item) => (
            <div key={item} className="mb-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">{item}</div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">About the project</h2>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">SafeHood helps residents submit safety reports, follow progress, read announcements, and discuss important updates in one clean dashboard.</p>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3">
        {[
          ['Incident Reporting', 'Submit detailed reports with location, severity, and image upload.'],
          ['Status Tracking', 'Follow reports from Reported to In Progress to Resolved.'],
          ['Community Feed', 'Read announcements, updates, and comments from neighbors.']
        ].map(([title, text]) => (
          <div className="card" key={title}><MessageSquare className="mb-4 text-brand" /><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-slate-500">{text}</p></div>
        ))}
      </section>
    </div>
  );
}
