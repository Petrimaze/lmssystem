import React, { useState, useMemo, useEffect } from 'react';
import type { User, Group, Assignment, UserAssignment, Notification, UserRole } from './types';
import { USERS, GROUPS, ASSIGNMENT_BANK, USER_ASSIGNMENTS } from './services/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import CuratorAdminPanel from './components/CuratorAdminPanel';
import ManagerAdminPanel from './components/ManagerAdminPanel';
import Marketplace from './components/Marketplace';

type View = 'profile' | 'admin' | 'manager-admin' | 'marketplace';

export default function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    // Data state
    const [users, setUsers] = useState<User[]>(USERS);
    const [groups, setGroups] = useState<Group[]>(GROUPS);
    const [assignmentBank, setAssignmentBank] = useState<Assignment[]>(ASSIGNMENT_BANK);
    const [userAssignments, setUserAssignments] = useState<UserAssignment[]>(USER_ASSIGNMENTS);
    const [currentUser, setCurrentUser] = useState<User>(users.find(u => u.role === 'manager')!);
    const [notifications, setNotifications] = useState<Notification[]>(currentUser.notifications);

    const marketplaceAssignments = useMemo(() => 
        assignmentBank.filter(a => a.isPublic),
        [assignmentBank]
    );

    const [currentView, setCurrentView] = useState<View>('manager-admin');

    useEffect(() => {
        const user = users.find(u => u.id === currentUser.id);
        if (user) {
            setNotifications(user.notifications);
        }
        
        switch (user?.role) {
            case 'student':
                setCurrentView('profile');
                break;
            case 'curator':
                setCurrentView('admin');
                break;
            case 'manager':
                setCurrentView('manager-admin');
                break;
            default:
                setCurrentView('profile');
        }
    }, [currentUser, users]);

    const handleCreateNotification = (userIds: string[], message: string) => {
        const newNotification: Omit<Notification, 'id' | 'userId'> = {
            message,
            read: false,
            timestamp: new Date().toISOString(),
        };

        setUsers(prevUsers => 
            prevUsers.map(user => {
                if (userIds.includes(user.id)) {
                    const userNotifications = [...user.notifications, { ...newNotification, id: `notif-${Date.now()}-${Math.random()}`, userId: user.id }];
                    return { ...user, notifications: userNotifications };
                }
                return user;
            })
        );
    };

    const handleMarkNotificationsRead = () => {
        setUsers(prevUsers => 
            prevUsers.map(user => {
                if (user.id === currentUser.id) {
                    const updatedNotifications = user.notifications.map(n => ({ ...n, read: true }));
                    return { ...user, notifications: updatedNotifications };
                }
                return user;
            })
        );
    };

    const handleSetView = (view: View) => {
        const allowedViews: Partial<Record<UserRole, View[]>> = {
            student: ['profile'],
            curator: ['profile', 'admin', 'marketplace'],
            manager: ['manager-admin', 'marketplace', 'profile'] // Managers can now see marketplace and their profile
        };
        if (allowedViews[currentUser.role]?.includes(view)) {
            setCurrentView(view);
        }
    };
    
    const handleAssignHomework = (assignment: Assignment, studentIds: string[], courseContext: string) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const newAssignments: UserAssignment[] = studentIds.map(studentId => ({
            id: `ua-${Date.now()}-${Math.random()}`,
            assignment,
            studentId,
            courseContext,
            status: 'assigned',
            assignedDate: new Date().toISOString(),
            dueDate: dueDate.toISOString(),
        }));
        setUserAssignments(prev => [...prev, ...newAssignments]);
        
        const student = users.find(u=>u.id === studentIds[0]);
        const message = `Вам назначено новое задание: "${assignment.title}".`;
        handleCreateNotification(studentIds, message);

        const curator = users.find(u => u.id === currentUser.id);
        if (curator) {
            const curatorMessage = `Вы назначили задание "${assignment.title}" для ${studentIds.length > 1 ? `${studentIds.length} студентов` : student?.name}.`;
            handleCreateNotification([curator.id], curatorMessage);
        }
    };
    
    const handleUpdateUserAssignment = (updatedAssignment: UserAssignment) => {
        const originalAssignment = userAssignments.find(ua => ua.id === updatedAssignment.id);
        setUserAssignments(prev => prev.map(ua => ua.id === updatedAssignment.id ? updatedAssignment : ua));

        if (originalAssignment?.status === 'assigned' && updatedAssignment.status === 'submitted') {
            const student = users.find(u => u.id === updatedAssignment.studentId);
            const curator = users.find(u => u.id === groups.find(g => g.id === student?.groupId)?.curatorId);
            if (curator && student) {
                const message = `Студент ${student.name} сдал задание: "${updatedAssignment.assignment.title}".`;
                handleCreateNotification([curator.id], message);
            }
        } else if (originalAssignment?.status === 'submitted' && updatedAssignment.status === 'reviewed') {
            const message = `Ваше задание "${updatedAssignment.assignment.title}" проверено.`;
            handleCreateNotification([updatedAssignment.studentId], message);
        }
    };

    const handleAddToAssignmentBank = (newAssignment: Assignment) => {
        const assignmentWithOwner: Assignment = {
            ...newAssignment,
            id: `bank-${Date.now()}`,
            authorId: currentUser.id,
            authorName: currentUser.name,
            isPublic: false,
            tags: ['Новое']
        }
        setAssignmentBank(prev => [...prev, assignmentWithOwner]);
    };

    const handleJoinGroup = (inviteCode: string): boolean => {
        const group = groups.find(g => g.inviteCode === inviteCode);
        if (!group || currentUser.groupId) {
            return false;
        }

        setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? { ...u, groupId: group.id } : u));
        setGroups(prevGroups => prevGroups.map(g => g.id === group.id ? { ...g, studentIds: [...g.studentIds, currentUser.id] } : g));
        
        handleCreateNotification([currentUser.id], `Вы успешно присоединились к группе "${group.name}".`);
        handleCreateNotification([group.curatorId], `Студент ${currentUser.name} присоединился к вашей группе "${group.name}".`);

        return true;
    };

    const handlePublishToMarketplace = (assignmentId: string) => {
        setAssignmentBank(prev => prev.map(a => a.id === assignmentId ? { ...a, isPublic: true } : a));
    };

    const handleImportFromMarketplace = (assignment: Assignment) => {
        const newAssignment = {
            ...assignment,
            id: `bank-${Date.now()}`,
            isPublic: false, 
        };
        handleAddToAssignmentBank(newAssignment);
        handleCreateNotification([currentUser.id], `Задание "${assignment.title}" импортировано в ваш банк.`);
    };

    const renderContent = () => {
        switch (currentView) {
            case 'admin':
                return <CuratorAdminPanel 
                            curator={currentUser}
                            groups={groups.filter(g => g.curatorId === currentUser.id)}
                            allUsers={users}
                            assignmentBank={assignmentBank.filter(a => a.authorId === currentUser.id || !a.authorId)}
                            userAssignments={userAssignments}
                            onAssignHomework={handleAssignHomework}
                            onAddToBank={handleAddToAssignmentBank}
                            onPublish={handlePublishToMarketplace}
                        />;
            case 'manager-admin':
                 return <ManagerAdminPanel 
                            allUsers={users}
                            allGroups={groups}
                            allUserAssignments={userAssignments}
                            onUpdateUserAssignment={handleUpdateUserAssignment}
                        />
            case 'marketplace':
                return <Marketplace 
                            assignments={marketplaceAssignments} 
                            onImport={handleImportFromMarketplace} 
                        />;
            case 'profile':
            default:
                return <UserProfile 
                            user={currentUser} 
                            userAssignments={userAssignments.filter(ua => ua.studentId === currentUser.id)}
                            onUpdateUserAssignment={handleUpdateUserAssignment}
                            onJoinGroup={handleJoinGroup}
                        />;
        }
    };

    const getHeaderTitle = () => {
        switch (currentView) {
            case 'profile': return `Профиль: ${currentUser.name}`;
            case 'admin': return "Панель куратора";
            case 'manager-admin': return "Панель менеджера";
            case 'marketplace': return "Маркетплейс заданий";
            default: return "LMS Платформа";
        }
    };

    return (
        <div className="min-h-screen flex bg-background text-text-main font-sans">
            <Sidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setSidebarOpen} 
                onSetView={handleSetView}
                currentUser={currentUser}
                currentView={currentView}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                 <Header 
                    onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
                    title={getHeaderTitle()} 
                    currentUser={currentUser}
                    allUsers={users}
                    onSwitchUser={setCurrentUser}
                    notifications={notifications}
                    onMarkNotificationsRead={handleMarkNotificationsRead}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}