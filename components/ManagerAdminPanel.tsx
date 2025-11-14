import React, { useState } from 'react';
import type { User, Group, UserAssignment } from '../types';

interface ManagerAdminPanelProps {
  allUsers: User[];
  allGroups: Group[];
  allUserAssignments: UserAssignment[];
  onUpdateUserAssignment: (assignment: UserAssignment) => void;
}

export default function ManagerAdminPanel({
  allUsers,
  allGroups,
  allUserAssignments
}: ManagerAdminPanelProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'users' | 'groups' | 'assignments'>('overview');

  const students = allUsers.filter(u => u.role === 'student');
  const curators = allUsers.filter(u => u.role === 'curator');
  const totalAssignments = allUserAssignments.length;
  const completedAssignments = allUserAssignments.filter(ua => ua.status === 'reviewed').length;
  const pendingReview = allUserAssignments.filter(ua => ua.status === 'submitted').length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-card-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <p className="text-3xl font-bold text-text-main">{students.length}</p>
              <p className="text-sm text-text-secondary">Учеников</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <div>
              <p className="text-3xl font-bold text-text-main">{curators.length}</p>
              <p className="text-sm text-text-secondary">Кураторов</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
              📚
            </div>
            <div>
              <p className="text-3xl font-bold text-text-main">{allGroups.length}</p>
              <p className="text-sm text-text-secondary">Групп</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-card-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
              📝
            </div>
            <div>
              <p className="text-3xl font-bold text-text-main">{totalAssignments}</p>
              <p className="text-sm text-text-secondary">Всего заданий</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card rounded-lg border border-card-border">
        <div className="border-b border-card-border">
          <nav className="flex gap-2 p-2">
            {[
              { id: 'overview' as const, label: 'Обзор', icon: '📊' },
              { id: 'users' as const, label: 'Пользователи', icon: '👥' },
              { id: 'groups' as const, label: 'Группы', icon: '📚' },
              { id: 'assignments' as const, label: 'Задания', icon: '📝' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedView === tab.id
                    ? 'bg-primary text-text-main'
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview */}
          {selectedView === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                  Статистика платформы
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-card-border rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">Выполнено заданий</p>
                    <p className="text-2xl font-bold text-green-600">{completedAssignments}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(completedAssignments / totalAssignments) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border border-card-border rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">На проверке</p>
                    <p className="text-2xl font-bold text-blue-600">{pendingReview}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(pendingReview / totalAssignments) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border border-card-border rounded-lg p-4">
                    <p className="text-sm text-text-secondary mb-1">К выполнению</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {totalAssignments - completedAssignments - pendingReview}
                    </p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${((totalAssignments - completedAssignments - pendingReview) / totalAssignments) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-text-main mb-3">
                  Последние активности
                </h3>
                <div className="space-y-2">
                  {allUserAssignments
                    .slice()
                    .sort((a, b) => {
                      const dateA = new Date(a.submittedDate || a.assignedDate).getTime();
                      const dateB = new Date(b.submittedDate || b.assignedDate).getTime();
                      return dateB - dateA;
                    })
                    .slice(0, 10)
                    .map((ua) => {
                      const student = allUsers.find(u => u.id === ua.studentId);
                      return (
                        <div
                          key={ua.id}
                          className="flex items-center justify-between p-3 border border-card-border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={student?.avatarUrl}
                              alt={student?.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-text-main">
                                {student?.name}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {ua.assignment.title}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              ua.status === 'reviewed'
                                ? 'bg-green-100 text-green-800'
                                : ua.status === 'submitted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {ua.status === 'reviewed'
                              ? 'Проверено'
                              : ua.status === 'submitted'
                              ? 'Сдано'
                              : 'Назначено'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {selectedView === 'users' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                Все пользователи
              </h3>

              {/* Curators */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-text-main mb-3">
                  Кураторы ({curators.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {curators.map((curator) => {
                    const curatorGroups = allGroups.filter(g => g.curatorId === curator.id);
                    const studentCount = curatorGroups.reduce((sum, g) => sum + g.studentIds.length, 0);

                    return (
                      <div
                        key={curator.id}
                        className="border border-card-border rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={curator.avatarUrl}
                            alt={curator.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-text-main">{curator.name}</p>
                            <p className="text-xs text-text-secondary">Куратор</p>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm text-text-secondary">
                          <span>{curatorGroups.length} групп</span>
                          <span>{studentCount} учеников</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Students */}
              <div>
                <h4 className="text-lg font-semibold text-text-main mb-3">
                  Ученики ({students.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {students.map((student) => {
                    const studentAssignments = allUserAssignments.filter(ua => ua.studentId === student.id);
                    const completed = studentAssignments.filter(ua => ua.status === 'reviewed').length;
                    const group = allGroups.find(g => g.id === student.groupId);

                    return (
                      <div
                        key={student.id}
                        className="border border-card-border rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={student.avatarUrl}
                            alt={student.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-main text-sm truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-text-secondary truncate">
                              {group?.name || 'Без группы'}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary">
                          Выполнено: {completed}/{studentAssignments.length}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Groups */}
          {selectedView === 'groups' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                Все группы
              </h3>
              <div className="space-y-4">
                {allGroups.map((group) => {
                  const curator = allUsers.find(u => u.id === group.curatorId);
                  const groupAssignments = allUserAssignments.filter(ua =>
                    group.studentIds.includes(ua.studentId)
                  );

                  return (
                    <div
                      key={group.id}
                      className="border border-card-border rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-text-main mb-1">
                            {group.name}
                          </h4>
                          <p className="text-sm text-text-secondary">
                            Куратор: {curator?.name}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-text-secondary text-sm rounded font-mono">
                          {group.inviteCode}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-2xl font-bold text-text-main">{group.studentIds.length}</p>
                          <p className="text-xs text-text-secondary">Учеников</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-text-main">{groupAssignments.length}</p>
                          <p className="text-xs text-text-secondary">Заданий</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {groupAssignments.filter(ua => ua.status === 'reviewed').length}
                          </p>
                          <p className="text-xs text-text-secondary">Проверено</p>
                        </div>
                      </div>

                      {/* Students in group */}
                      <div className="flex flex-wrap gap-2">
                        {group.studentIds.map((studentId) => {
                          const student = allUsers.find(u => u.id === studentId);
                          return student ? (
                            <div
                              key={studentId}
                              className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full"
                            >
                              <img
                                src={student.avatarUrl}
                                alt={student.name}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm text-text-main">{student.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assignments */}
          {selectedView === 'assignments' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                Все назначенные задания
              </h3>
              <div className="space-y-3">
                {allUserAssignments.map((ua) => {
                  const student = allUsers.find(u => u.id === ua.studentId);
                  const group = allGroups.find(g => g.studentIds.includes(ua.studentId));
                  const curator = group ? allUsers.find(u => u.id === group.curatorId) : null;

                  return (
                    <div
                      key={ua.id}
                      className="border border-card-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-text-main">
                              {ua.assignment.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                ua.status === 'reviewed'
                                  ? 'bg-green-100 text-green-800'
                                  : ua.status === 'submitted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {ua.status === 'reviewed'
                                ? 'Проверено'
                                : ua.status === 'submitted'
                                ? 'Сдано'
                                : 'Назначено'}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <img src={student?.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                              {student?.name}
                            </span>
                            <span>•</span>
                            <span>{ua.courseContext}</span>
                            <span>•</span>
                            <span>Куратор: {curator?.name}</span>
                          </div>

                          <div className="mt-2 text-xs text-text-secondary">
                            Дедлайн: {new Date(ua.dueDate).toLocaleDateString('ru-RU')}
                            {ua.submittedDate && (
                              <> • Сдано: {new Date(ua.submittedDate).toLocaleDateString('ru-RU')}</>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
