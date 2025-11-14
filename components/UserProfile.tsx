import React, { useState } from 'react';
import type { User, UserAssignment } from '../types';

interface UserProfileProps {
  user: User;
  userAssignments: UserAssignment[];
  onUpdateUserAssignment: (assignment: UserAssignment) => void;
  onJoinGroup: (inviteCode: string) => boolean;
}

export default function UserProfile({
  user,
  userAssignments,
  onUpdateUserAssignment,
  onJoinGroup
}: UserProfileProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<UserAssignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [filter, setFilter] = useState<'all' | 'assigned' | 'submitted' | 'reviewed'>('all');

  const filteredAssignments = filter === 'all'
    ? userAssignments
    : userAssignments.filter(ua => ua.status === filter);

  const handleSubmit = () => {
    if (!selectedAssignment || !submissionText.trim()) return;

    const updated: UserAssignment = {
      ...selectedAssignment,
      status: 'submitted',
      submission: submissionText,
      submittedDate: new Date().toISOString()
    };

    onUpdateUserAssignment(updated);
    setSelectedAssignment(null);
    setSubmissionText('');
  };

  const handleJoinGroup = () => {
    const success = onJoinGroup(inviteCode);
    if (success) {
      setInviteCode('');
      alert('Вы успешно присоединились к группе!');
    } else {
      alert('Неверный код приглашения или вы уже в группе');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return 'Назначено';
      case 'submitted': return 'Сдано';
      case 'reviewed': return 'Проверено';
      default: return status;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="flex items-start gap-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-serif font-bold text-text-main mb-1">
              {user.name}
            </h2>
            <p className="text-text-secondary">Ученик</p>

            {/* Stats */}
            <div className="mt-4 flex gap-6">
              <div>
                <p className="text-2xl font-bold text-text-main">
                  {userAssignments.filter(ua => ua.status === 'reviewed').length}
                </p>
                <p className="text-sm text-text-secondary">Выполнено</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-main">
                  {userAssignments.filter(ua => ua.status === 'submitted').length}
                </p>
                <p className="text-sm text-text-secondary">На проверке</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-main">
                  {userAssignments.filter(ua => ua.status === 'assigned').length}
                </p>
                <p className="text-sm text-text-secondary">К выполнению</p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Group */}
        {!user.groupId && (
          <div className="mt-6 pt-6 border-t border-card-border">
            <h3 className="text-sm font-semibold text-text-main mb-3">
              Присоединиться к группе
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Введите код приглашения"
                className="flex-1 px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleJoinGroup}
                disabled={!inviteCode.trim()}
                className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-text-main font-semibold rounded-lg transition-colors"
              >
                Присоединиться
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assignments */}
      <div className="bg-card rounded-lg border border-card-border">
        <div className="p-6 border-b border-card-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif font-bold text-text-main">
              Мои задания
            </h3>
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'assigned', 'submitted', 'reviewed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-primary text-text-main'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'Все' : getStatusLabel(f)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredAssignments.length === 0 ? (
            <p className="text-center text-text-secondary py-8">
              Нет заданий
            </p>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((ua) => {
                const overdue = ua.status === 'assigned' && isOverdue(ua.dueDate);
                return (
                  <div
                    key={ua.id}
                    className={`border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      overdue ? 'border-red-300 bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-text-main">
                            {ua.assignment.title}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ua.status)}`}>
                            {getStatusLabel(ua.status)}
                          </span>
                          {overdue && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                              Просрочено
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-text-secondary mb-2">
                          {ua.courseContext}
                        </p>

                        <div className="flex gap-4 text-xs text-text-secondary">
                          <span>
                            Дедлайн: {new Date(ua.dueDate).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {ua.submittedDate && (
                            <span>
                              Сдано: {new Date(ua.submittedDate).toLocaleDateString('ru-RU')}
                            </span>
                          )}
                        </div>

                        {ua.curatorFeedback && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm font-semibold text-green-900 mb-1">
                              Отзыв куратора:
                            </p>
                            <p className="text-sm text-green-800 whitespace-pre-wrap">
                              {ua.curatorFeedback}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedAssignment(ua)}
                        className="px-4 py-2 bg-primary hover:bg-primary-hover text-text-main font-medium rounded-lg transition-colors whitespace-nowrap"
                      >
                        {ua.status === 'assigned' ? 'Сдать' : 'Просмотр'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-card-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-text-main">
                  {selectedAssignment.assignment.title}
                </h3>
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setSubmissionText('');
                  }}
                  className="text-text-secondary hover:text-text-main"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Assignment description */}
              <div>
                <h4 className="font-semibold text-text-main mb-2">Задание:</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-text-secondary whitespace-pre-wrap">
                    {selectedAssignment.assignment.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedAssignment.assignment.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-text-secondary text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Submission or view */}
              {selectedAssignment.status === 'assigned' ? (
                <div>
                  <h4 className="font-semibold text-text-main mb-2">Ваше решение:</h4>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Введите ваш ответ..."
                    rows={12}
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelectedAssignment(null);
                        setSubmissionText('');
                      }}
                      className="px-6 py-2 border border-card-border text-text-main rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!submissionText.trim()}
                      className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-text-main font-semibold rounded-lg transition-colors"
                    >
                      Сдать задание
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-text-main mb-2">Ваш ответ:</h4>
                  <div className="p-4 bg-gray-50 rounded-lg border border-card-border">
                    <p className="text-text-main whitespace-pre-wrap">
                      {selectedAssignment.submission || 'Нет ответа'}
                    </p>
                  </div>

                  {selectedAssignment.curatorFeedback && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-text-main mb-2">Отзыв куратора:</h4>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-900 whitespace-pre-wrap">
                          {selectedAssignment.curatorFeedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
