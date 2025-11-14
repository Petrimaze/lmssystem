import React, { useState } from 'react';
import type { Assignment } from '../types';

interface MarketplaceProps {
  assignments: Assignment[];
  onImport: (assignment: Assignment) => void;
}

export default function Marketplace({ assignments, onImport }: MarketplaceProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Get all unique tags
  const allTags = Array.from(new Set(assignments.flatMap(a => a.tags)));

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || assignment.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-card-border p-6">
        <h2 className="text-2xl font-serif font-bold text-text-main mb-2">
          Маркетплейс заданий
        </h2>
        <p className="text-text-secondary">
          Используйте готовые задания от других кураторов или делитесь своими
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border border-card-border p-6">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или описанию..."
              className="w-full px-4 py-2 border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTag === 'all'
                  ? 'bg-primary text-text-main'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              Все ({assignments.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-text-main'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {tag} ({assignments.filter(a => a.tags.includes(tag)).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-secondary">
            Ничего не найдено
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-card border border-card-border rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAssignment(assignment)}
            >
              {/* Header */}
              <div className="mb-3">
                <h3 className="font-semibold text-text-main mb-1 line-clamp-2">
                  {assignment.title}
                </h3>
                <p className="text-xs text-text-secondary">
                  Автор: {assignment.authorName}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-3 line-clamp-3">
                {assignment.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {assignment.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {assignment.tags.length > 3 && (
                  <span className="px-2 py-1 text-text-secondary text-xs">
                    +{assignment.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-card-border">
                <span className="text-xs text-text-secondary">
                  {assignment.submissionFormat === 'text' ? '📝 Текст' : '📎 Файл'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImport(assignment);
                  }}
                  className="px-3 py-1 bg-primary hover:bg-primary-hover text-text-main text-sm font-medium rounded transition-colors"
                >
                  Импортировать
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-card-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-main mb-1">
                    {selectedAssignment.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Автор: {selectedAssignment.authorName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-text-secondary hover:text-text-main"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Description */}
              <div>
                <h4 className="font-semibold text-text-main mb-2">Описание задания:</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-text-secondary whitespace-pre-wrap">
                    {selectedAssignment.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold text-text-main mb-2">Теги:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAssignment.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-text-secondary text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h4 className="font-semibold text-text-main mb-2">Формат сдачи:</h4>
                <p className="text-text-secondary">
                  {selectedAssignment.submissionFormat === 'text'
                    ? '📝 Текстовое поле'
                    : '📎 Загрузка файла'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-card-border">
                <button
                  onClick={() => {
                    onImport(selectedAssignment);
                    setSelectedAssignment(null);
                  }}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary-hover text-text-main font-semibold rounded-lg transition-colors"
                >
                  Импортировать в мой банк
                </button>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="px-6 py-3 border border-card-border text-text-main rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
