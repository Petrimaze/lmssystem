import React, { useState } from 'react';
import type { User, Group, Assignment, UserAssignment } from '../types';

interface CuratorAdminPanelProps {
  curator: User;
  groups: Group[];
  allUsers: User[];
  assignmentBank: Assignment[];
  userAssignments: UserAssignment[];
  onAssignHomework: (assignment: Assignment, studentIds: string[], courseContext: string) => void;
  onAddToBank: (assignment: Omit<Assignment, 'id' | 'authorId' | 'authorName' | 'isPublic' | 'tags'>) => void;
  onPublish: (assignmentId: string) => void;
}

type Tab = 'students' | 'assignments' | 'create' | 'review';

export default function CuratorAdminPanel({
  curator,
  groups,
  allUsers,
  assignmentBank,
  userAssignments,
  onAssignHomework,
  onAddToBank,
  onPublish
}: CuratorAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('review');
  const [selectedAssignment, setSelectedAssignment] = useState<UserAssignment | null>(null);
  const [feedback, setFeedback] = useState('');

  // Create assignment form state
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    submissionFormat: 'text' as 'text' | 'file'
  });

  // Get students from curator's groups
  const myStudents = allUsers.filter(u =>
    groups.some(g => g.studentIds.includes(u.id))
  );

  // Get assignments to review
  const toReview = userAssignments.filter(ua =>
    ua.status === 'submitted' &&
    myStudents.some(s => s.id === ua.studentId)
  );

  const handleCreateAssignment = () => {
    if (!newAssignment.title.trim() || !newAssignment.description.trim()) {
      alert('Заполните все поля');
      return;
    }

    onAddToBank(newAssignment);
    setNewAssignment({ title: '', description: '', submissionFormat: 'text' });
    alert('Задание добавлено в банк');
    setActiveTab('assignments');
  };

  const handleAssignToGroup = (assignment: Assignment, groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    onAssignHomework(assignment, group.studentIds, group.name);
    alert(`Задание назначено группе "${group.name}"`);
  };

  const handleReview = () => {
    if (!selectedAssignment || !feedback.trim()) {
      alert('Введите отзыв');
      return;
    }

    const updated: UserAssignment = {
      ...selectedAssignment,
      status: 'reviewed',
      curatorFeedback: feedback,
      reviewedDate: new Date().toISOString()
    };

    // This would call onUpdateUserAssignment in real app
    alert('Работа проверена!');
    setSelectedAssignment(null);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-card-border p-6">
          <p className="text-3xl font-bold text-text-main">{groups.length}</p>
          <p className="text-sm text-text-secondary mt-1">Групп</p>
        </div>
        <div className="bg-card rounded-lg border border-card-border p-6">
          <p className="text-3xl font-bold text-text-main">{myStudents.length}</p>
          <p className="text-sm text-text-secondary mt-1">Учеников</p>
        </div>
        <div className="bg-card rounded-lg border border-card-border p-6">
          <p className="text-3xl font-bold text-text-main">{assignmentBank.length}</p>
          <p className="text-sm text-text-secondary mt-1">Заданий в банке</p>
        </div>
        <div className="bg-card rounded-lg border border-card-border p-6">
          <p className="text-3xl font-bold text-primary">{toReview.length}</p>
          <p className="text-sm text-text-secondary mt-1">На проверке</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-card-border">
        <div className="border-b border-card-border">
          <nav className="flex gap-2 p-2">
            {[
              { id: 'review' as Tab, label: 'На проверке', badge: toReview.length },
              { id: 'students' as Tab, label: 'Ученики' },
              { id: 'assignments' as Tab, label: 'Банк заданий' },
              { id: 'create' as Tab, label: 'Создать задание' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'bg-primary text-text-main'
                    : 'text-text-secondary hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Review Tab */}
          {activeTab === 'review' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                Работы на проверке
              </h3>
              {toReview.length === 0 ? (
                <p className="text-center text-text-secondary py-8">
                  Нет работ на проверке
                </p>
              ) : (
                <div className="space-y-3">
                  {toReview.map((ua) => {
                    const student = allUsers.find(u => u.id === ua.studentId);
                    return (
                      <div
                        key={ua.id}
                        className="border border-card-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <img
                                src={student?.avatarUrl}
                                alt={student?.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <h4 className="font-semibold text-text-main">
                                  {ua.assignment.title}
                                </h4>
                                <p className="text-sm text-text-secondary">
                                  {student?.name} • {ua.courseContext}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-text-secondary">
                              Сдано: {new Date(ua.submittedDate!).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedAssignment(ua)}
                            className="px-4 py-2 bg-primary hover:bg-primary-hover text-text-main font-medium rounded-lg transition-colors whitespace-nowrap"
                          >
                            Проверить
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                Мои ученики
              </h3>
              {groups.map((group) => (
                <div key={group.id} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-text-main">{group.name}</h4>
                    <span className="text-sm text-text-secondary">
                      Код: <span className="font-mono font-bold">{group.inviteCode}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.studentIds.map((studentId) => {
                      const student = allUsers.find(u => u.id === studentId);
                      if (!student) return null;

                      const studentAssignments = userAssignments.filter(ua => ua.studentId === studentId);
                      const completed = studentAssignments.filter(ua => ua.status === 'reviewed').length;

                      return (
                        <div
                          key={studentId}
                          className="border border-card-border rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-text-main">{student.name}</p>
                              <p className="text-xs text-text-secondary">
                                Выполнено: {completed}/{studentAssignments.length}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assignments Bank Tab */}
          {activeTab === 'assignments' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                Банк заданий
              </h3>
              <div className="space-y-3">
                {assignmentBank.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="border border-card-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-text-main">
                            {assignment.title}
                          </h4>
                          {assignment.isPublic && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                              Опубликовано
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                          {assignment.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {assignment.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {groups.map((group) => (
                          <button
                            key={group.id}
                            onClick={() => handleAssignToGroup(assignment, group.id)}
                            className="px-3 py-1 bg-primary hover:bg-primary-hover text-text-main text-sm font-medium rounded transition-colors whitespace-nowrap"
                          >
                            → {group.name.substring(0, 15)}...
                          </button>
                        ))}
                        {!assignment.isPublic && (
                          <button
                            onClick={() => onPublish(assignment.id)}
                            className="px-3 py-1 border border-card-border text-text-secondary text-sm rounded hover:bg-gray-50 transition-colors"
                          >
                            В маркетплейс
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Assignment Tab */}
          {activeTab === 'create' && (
            <div className="max-w-2xl">
              <h3 className="text-xl font-serif font-bold text-text-main mb-4">
                Создать новое задание
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Название задания
                  </label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    placeholder="Например: Эссе по обществознанию"
                    className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Описание и требования
                  </label>
                  <textarea
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    placeholder="Подробное описание задания, критерии оценивания..."
                    rows={10}
                    className="w-full px-4 py-3 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Формат сдачи
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={newAssignment.submissionFormat === 'text'}
                        onChange={() => setNewAssignment({ ...newAssignment, submissionFormat: 'text' })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-text-main">Текст</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={newAssignment.submissionFormat === 'file'}
                        onChange={() => setNewAssignment({ ...newAssignment, submissionFormat: 'file' })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-text-main">Файл</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateAssignment}
                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-text-main font-semibold rounded-lg transition-colors"
                  >
                    Создать задание
                  </button>
                  <button
                    onClick={() => setNewAssignment({ title: '', description: '', submissionFormat: 'text' })}
                    className="px-6 py-2 border border-card-border text-text-main rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Очистить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-main">
                    {selectedAssignment.assignment.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {allUsers.find(u => u.id === selectedAssignment.studentId)?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setFeedback('');
                  }}
                  className="text-text-secondary hover:text-text-main"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Assignment */}
              <div>
                <h4 className="font-semibold text-text-main mb-2">Задание:</h4>
                <p className="text-text-secondary text-sm whitespace-pre-wrap">
                  {selectedAssignment.assignment.description}
                </p>
              </div>

              {/* Student answer */}
              <div>
                <h4 className="font-semibold text-text-main mb-2">Ответ ученика:</h4>
                <div className="p-4 bg-gray-50 rounded-lg border border-card-border">
                  <p className="text-text-main whitespace-pre-wrap">
                    {selectedAssignment.submission}
                  </p>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <h4 className="font-semibold text-text-main mb-2">Ваш отзыв:</h4>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Напишите развернутый отзыв на работу ученика..."
                  rows={8}
                  className="w-full px-4 py-3 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setFeedback('');
                  }}
                  className="px-6 py-2 border border-card-border text-text-main rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleReview}
                  className="px-6 py-2 bg-primary hover:bg-primary-hover text-text-main font-semibold rounded-lg transition-colors"
                >
                  Отправить отзыв
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
