import React from 'react';
import type { User, UserRole } from '../types';

type View = 'profile' | 'admin' | 'manager-admin' | 'marketplace';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSetView: (view: View) => void;
  currentUser: User;
  currentView: View;
}

export default function Sidebar({ isOpen, setIsOpen, onSetView, currentUser, currentView }: SidebarProps) {
  const menuItems = getMenuItems(currentUser.role);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card border-r border-card-border z-50
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-between">
            {isOpen && (
              <h2 className="font-serif text-2xl font-bold text-text-main">
                Общее Дело
              </h2>
            )}
            {!isOpen && (
              <span className="text-2xl font-serif font-bold text-primary">
                ОД
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onSetView(item.view);
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${isActive
                      ? 'bg-primary text-text-main font-semibold'
                      : 'text-text-secondary hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User info */}
          <div className={`
            mt-auto pt-4 border-t border-card-border
            ${isOpen ? 'block' : 'hidden'}
          `}>
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full"
              />
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-text-secondary capitalize">
                    {getRoleLabel(currentUser.role)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function getMenuItems(role: UserRole): Array<{ view: View; label: string; icon: string }> {
  const allItems = {
    profile: { view: 'profile' as View, label: 'Мой профиль', icon: '👤' },
    admin: { view: 'admin' as View, label: 'Панель куратора', icon: '📚' },
    managerAdmin: { view: 'manager-admin' as View, label: 'Управление', icon: '⚙️' },
    marketplace: { view: 'marketplace' as View, label: 'Маркетплейс', icon: '🛒' }
  };

  switch (role) {
    case 'student':
      return [allItems.profile];
    case 'curator':
      return [allItems.profile, allItems.admin, allItems.marketplace];
    case 'manager':
      return [allItems.profile, allItems.managerAdmin, allItems.marketplace];
    default:
      return [allItems.profile];
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'student': return 'Ученик';
    case 'curator': return 'Куратор';
    case 'manager': return 'Менеджер';
    default: return role;
  }
}
