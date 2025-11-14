import type { User, Group, Assignment, UserAssignment, Notification } from '../types';

// Mock users - кураторы и ученики для гуманитарных предметов
export const USERS: User[] = [
  // Менеджер
  {
    id: 'manager-1',
    name: 'Анна Петровна',
    role: 'manager',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    notifications: []
  },

  // Кураторы по разным предметам
  {
    id: 'curator-1',
    name: 'Михаил Иванов',
    role: 'curator',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    notifications: [
      {
        id: 'notif-1',
        userId: 'curator-1',
        message: 'Студент Алексей Смирнов сдал эссе по обществознанию',
        read: false,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  },
  {
    id: 'curator-2',
    name: 'Елена Сергеева',
    role: 'curator',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    notifications: []
  },
  {
    id: 'curator-3',
    name: 'Дмитрий Волков',
    role: 'curator',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    notifications: []
  },

  // Студенты
  {
    id: 'student-1',
    name: 'Алексей Смирнов',
    role: 'student',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    groupId: 'group-1',
    notifications: [
      {
        id: 'notif-2',
        userId: 'student-1',
        message: 'Вам назначено новое задание: "Эссе: Политические режимы"',
        read: false,
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'notif-3',
        userId: 'student-1',
        message: 'Ваше задание "Анализ главы романа" проверено',
        read: true,
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  },
  {
    id: 'student-2',
    name: 'Мария Кузнецова',
    role: 'student',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    groupId: 'group-1',
    notifications: []
  },
  {
    id: 'student-3',
    name: 'Иван Петров',
    role: 'student',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    groupId: 'group-1',
    notifications: []
  },
  {
    id: 'student-4',
    name: 'София Иванова',
    role: 'student',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    groupId: 'group-2',
    notifications: []
  },
  {
    id: 'student-5',
    name: 'Артём Соколов',
    role: 'student',
    avatarUrl: 'https://i.pravatar.cc/150?img=14',
    groupId: 'group-2',
    notifications: []
  },
  {
    id: 'student-6',
    name: 'Анастасия Новикова',
    role: 'student',
    avatarUrl: 'https://i.pravatar.cc/150?img=16',
    notifications: []
  }
];

// Группы
export const GROUPS: Group[] = [
  {
    id: 'group-1',
    name: 'Обществознание - 11 класс (Группа А)',
    curatorId: 'curator-1',
    studentIds: ['student-1', 'student-2', 'student-3'],
    inviteCode: 'OBSH11A'
  },
  {
    id: 'group-2',
    name: 'Литература - 10 класс',
    curatorId: 'curator-2',
    studentIds: ['student-4', 'student-5'],
    inviteCode: 'LIT10B'
  },
  {
    id: 'group-3',
    name: 'Русский язык - подготовка к ЕГЭ',
    curatorId: 'curator-3',
    studentIds: [],
    inviteCode: 'RUS11C'
  }
];

// Банк заданий для гуманитарных предметов
export const ASSIGNMENT_BANK: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Эссе: Политические режимы',
    description: `Напишите эссе на тему "Демократия и авторитаризм: сравнительный анализ".

Требования:
- Объем: 250-350 слов
- Использовать примеры из истории или современности
- Четкая структура: введение, основная часть, заключение
- Аргументация с опорой на обществоведческие понятия

Критерии оценивания:
К1 - Раскрытие смысла темы (2 балла)
К2 - Теоретическая аргументация (2 балла)
К3 - Примеры (2 балла)
К4 - Структура и логика (1 балл)
Максимум: 7 баллов`,
    submissionFormat: 'text',
    authorId: 'curator-1',
    authorName: 'Михаил Иванов',
    isPublic: true,
    tags: ['Обществознание', 'Эссе', 'Политология', 'ЕГЭ']
  },
  {
    id: 'assign-2',
    title: 'Анализ романа "Преступление и наказание"',
    description: `Проанализируйте теорию Раскольникова и её крах.

Вопросы для анализа:
1. В чём суть теории "обыкновенных" и "необыкновенных" людей?
2. Какие аргументы приводит Раскольников в пользу своей теории?
3. Почему теория терпит крах?
4. Как автор опровергает идеи главного героя?

Объем: 300-400 слов.
Цитируйте текст для подтверждения своих мыслей.`,
    submissionFormat: 'text',
    authorId: 'curator-2',
    authorName: 'Елена Сергеева',
    isPublic: true,
    tags: ['Литература', 'Анализ', 'Достоевский']
  },
  {
    id: 'assign-3',
    title: 'Сочинение-рассуждение по тексту (ЕГЭ)',
    description: `Напишите сочинение по предложенному тексту (текст будет предоставлен на занятии).

Структура:
1. Проблема текста
2. Комментарий к проблеме (2 примера-иллюстрации + пояснения + связь между ними)
3. Позиция автора
4. Ваше отношение к позиции автора (согласие/несогласие + обоснование)
5. Заключение

Объем: не менее 150 слов
Максимум: 25 баллов (критерии ЕГЭ)`,
    submissionFormat: 'file',
    authorId: 'curator-3',
    authorName: 'Дмитрий Волков',
    isPublic: false,
    tags: ['Русский язык', 'ЕГЭ', 'Сочинение']
  },
  {
    id: 'assign-4',
    title: 'Тест: Конституционное право РФ',
    description: `Выполните тест по теме "Конституция РФ. Основы конституционного строя".

20 вопросов с выбором ответа.
Время выполнения: 30 минут.
Проходной балл: 70%

Темы:
- Структура Конституции РФ
- Права и свободы человека и гражданина
- Федеративное устройство
- Система органов власти`,
    submissionFormat: 'text',
    authorId: 'curator-1',
    authorName: 'Михаил Иванов',
    isPublic: true,
    tags: ['Право', 'Тест', 'Конституция']
  },
  {
    id: 'assign-5',
    title: 'Анализ стихотворения',
    description: `Проведите анализ стихотворения А.С. Пушкина "Я памятник себе воздвиг нерукотворный...".

План анализа:
1. История создания
2. Тема и идея
3. Композиция
4. Художественные средства (метафоры, эпитеты, сравнения)
5. Размер, рифма
6. Личное восприятие

Объем: 250-300 слов`,
    submissionFormat: 'text',
    authorId: 'curator-2',
    authorName: 'Елена Сергеева',
    isPublic: true,
    tags: ['Литература', 'Анализ', 'Поэзия', 'Пушкин']
  },
  {
    id: 'assign-6',
    title: 'Эссе: Роль личности в истории',
    description: `На примере исторической личности (по вашему выбору) раскройте тему "Может ли один человек изменить ход истории?".

Требования:
- Выберите конкретную историческую личность
- Опишите её роль и влияние на исторические события
- Приведите контраргументы (объективные факторы, условия эпохи)
- Сформулируйте свою позицию

Объем: 300-400 слов`,
    submissionFormat: 'text',
    authorId: 'curator-1',
    authorName: 'Михаил Иванов',
    isPublic: false,
    tags: ['Обществознание', 'История', 'Эссе']
  }
];

// Назначенные задания студентам
export const USER_ASSIGNMENTS: UserAssignment[] = [
  {
    id: 'ua-1',
    assignment: ASSIGNMENT_BANK[0], // Эссе: Политические режимы
    studentId: 'student-1',
    courseContext: 'Обществознание - 11 класс (Группа А)',
    status: 'submitted',
    submission: `Демократия и авторитаризм представляют собой два противоположных политических режима, различающихся по множеству параметров.

Демократия характеризуется народовластием, разделением властей, политическим плюрализмом и гарантированными правами человека. Классическим примером является США, где власть делится между тремя ветвями, а граждане участвуют в выборах на всех уровнях.

Авторитаризм же предполагает концентрацию власти в руках одного человека или узкой группы лиц, ограничение политических свобод и отсутствие реального разделения властей. Примером может служить Северная Корея с культом личности лидера.

Ключевые различия:
1. Источник власти: народ vs правящая элита
2. Права граждан: защищены законом vs ограничены
3. СМИ: свободные vs контролируемые
4. Выборы: конкурентные vs формальные

Однако в реальности многие режимы находятся между этими полюсами, сочетая элементы обоих типов. Это показывает, что политическая система - сложное явление, не всегда укладывающееся в чёткие категории.`,
    assignedDate: new Date(Date.now() - 172800000).toISOString(),
    submittedDate: new Date(Date.now() - 3600000).toISOString(),
    dueDate: new Date(Date.now() + 259200000).toISOString()
  },
  {
    id: 'ua-2',
    assignment: ASSIGNMENT_BANK[1], // Анализ Достоевского
    studentId: 'student-1',
    courseContext: 'Литература - дополнительные материалы',
    status: 'reviewed',
    submission: `Теория Раскольникова о делении людей на "обыкновенных" и "необыкновенных" является центральной идеей романа.

Согласно Раскольникову, люди делятся на два разряда: "материал" (обыкновенные) и "собственно люди" (необыкновенные). Первые должны жить в послушании, вторые имеют право преступить закон ради великой цели. "Необыкновенные люди имеют право... разрешить себе кровь по совести", - утверждает герой.

Раскольников причисляет себя ко второму разряду и решается на убийство, чтобы проверить свою теорию. Однако после преступления он переживает нравственные муки, что доказывает несостоятельность его идеи.

Достоевский опровергает теорию через страдания героя. Раскольников понимает, что "он не Наполеон", что убил не "вошь", а человека, и что никакая цель не оправдывает преступление против другой личности.

Развязка романа - духовное воскресение героя через любовь Сони - окончательно утверждает христианские ценности автора, противостоящие безбожной теории главного героя.`,
    curatorFeedback: `Отличная работа, Алексей! Вы четко раскрыли суть теории и показали её крах. Хорошо процитирован текст.

Что можно улучшить:
- Добавьте анализ образа Сони как антипода теории
- Упомяните сцену признания на площади

Оценка: 9/10`,
    assignedDate: new Date(Date.now() - 604800000).toISOString(),
    submittedDate: new Date(Date.now() - 172800000).toISOString(),
    reviewedDate: new Date(Date.now() - 86400000).toISOString(),
    dueDate: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ua-3',
    assignment: ASSIGNMENT_BANK[2], // Сочинение ЕГЭ
    studentId: 'student-2',
    courseContext: 'Обществознание - 11 класс (Группа А)',
    status: 'assigned',
    assignedDate: new Date(Date.now() - 86400000).toISOString(),
    dueDate: new Date(Date.now() + 518400000).toISOString()
  },
  {
    id: 'ua-4',
    assignment: ASSIGNMENT_BANK[3], // Тест по праву
    studentId: 'student-2',
    courseContext: 'Обществознание - 11 класс (Группа А)',
    status: 'assigned',
    assignedDate: new Date(Date.now() - 43200000).toISOString(),
    dueDate: new Date(Date.now() + 259200000).toISOString()
  },
  {
    id: 'ua-5',
    assignment: ASSIGNMENT_BANK[4], // Анализ стихотворения
    studentId: 'student-4',
    courseContext: 'Литература - 10 класс',
    status: 'submitted',
    submission: 'Прикреплен файл: analiz_pushkin.docx',
    assignedDate: new Date(Date.now() - 259200000).toISOString(),
    submittedDate: new Date(Date.now() - 7200000).toISOString(),
    dueDate: new Date(Date.now() + 172800000).toISOString()
  }
];
