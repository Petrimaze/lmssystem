import React, { useState, useRef, useEffect } from 'react';
import type { User, Notification } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  notifications: Notification[];
  onMarkNotificationsRead: () => void;
}

export default function Header({
  onMenuClick,
  title,
  currentUser,
  allUsers,
  onSwitchUser,
  notifications,
  onMarkNotificationsRead
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      setTimeout(onMarkNotificationsRead, 500);
    }
  };

  return (
    <header className="bg-card border-b border-card-border px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-text-main">
            {title}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-card-border overflow-hidden z-50">
                <div className="p-3 border-b border-card-border bg-gray-50">
                  <h3 className="font-semibold text-text-main">Уведомления</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-text-secondary">
                      Нет уведомлений
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notif.read ? 'bg-primary bg-opacity-10' : ''}`}
                      >
                        <p className="text-sm text-text-main">{notif.message}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          {formatTimestamp(notif.timestamp)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu - для демо переключения пользователей */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full"
              />
              <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User dropdown - для демо */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-card-border overflow-hidden z-50">
                <div className="p-3 border-b border-card-border bg-gray-50">
                  <p className="text-xs text-text-secondary mb-2">Демо: переключить пользователя</p>
                  <p className="text-sm font-medium text-text-main">{currentUser.name}</p>
                  <p className="text-xs text-text-secondary capitalize">{currentUser.role}</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowUserMenu(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        user.id === currentUser.id ? 'bg-primary bg-opacity-10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-medium text-text-main">{user.name}</p>
                          <p className="text-xs text-text-secondary capitalize">
                            {user.role === 'student' ? 'Ученик' : user.role === 'curator' ? 'Куратор' : 'Менеджер'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
