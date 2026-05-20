import { Bell, FileText, Home, LogOut, Megaphone, Shield, Siren } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const links = [
  ['Dashboard', '/app', Home],
  ['Report', '/app/report', Siren],
  ['My Reports', '/app/my-reports', FileText],
  ['Feed', '/app/feed', Megaphone],
  ['Admin', '/app/admin', Shield]
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const visibleLinks = links.filter(([label]) => user?.role === 'admin' || label !== 'Admin');

  async function loadNotifications() {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter((note) => !note.read).length);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  }

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  async function openNotification(note) {
    try {
      if (!note.read) {
        const { data } = await api.patch(`/notifications/${note.id}/read`);
        setNotifications(notifications.map((item) => item.id === note.id ? data.notification : item));
        setUnreadCount(Math.max(unreadCount - 1, 0));
      }
    } catch {
      // Navigation should still happen even if the read update fails.
    }

    setShowNotifications(false);
    navigate(note.action_url || '/app');
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:w-64 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Shield className="text-brand" size={24} /> SafeHood
          </div>
          <ThemeToggle />
        </div>
        <nav className="grid gap-2">
          {visibleLinks.map(([label, to, Icon]) => (
            <NavLink key={to} to={to} end={to === '/app'} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-blue-50 text-brand dark:bg-blue-950' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-red-500">
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-2xl font-bold">{user?.name || 'Resident'}</h1>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell className="text-slate-500" />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
            {showNotifications && (
              <div className="absolute right-0 z-20 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                  <h2 className="font-semibold">Notifications</h2>
                  <button type="button" onClick={loadNotifications} className="text-xs font-semibold text-brand">Refresh</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.slice(0, 8).map((note) => (
                    <button
                      type="button"
                      onClick={() => openNotification(note)}
                      key={note.id}
                      className={`block w-full border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${note.read ? 'opacity-70' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {!note.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand" />}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{note.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{note.message}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {!notifications.length && <p className="px-4 py-6 text-sm text-slate-500">No notifications yet.</p>}
                </div>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
