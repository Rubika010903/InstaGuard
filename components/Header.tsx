import React from 'react';
import { User, Notification } from '../types';
import { USERS } from '../constants';

interface NotificationBellProps {
  notifications: Notification[];
  onNotificationClick: (postId: string) => void;
  onClearNotifications: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onNotificationClick, onClearNotifications }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-lg hover:bg-brand-card focus:outline-none w-full flex items-center space-x-3 text-brand-text-secondary hover:text-brand-text">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        <span className="font-semibold">Notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div className="absolute left-full ml-2 bottom-0 w-80 bg-brand-card border border-brand-border rounded-lg shadow-lg z-20">
          <div className="p-3 font-bold border-b border-brand-border">Notifications</div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-brand-text-secondary">No new notifications.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map(notif => (
                <li key={notif.id} className={`border-b border-brand-border ${!notif.read ? 'bg-brand-accent-start/10' : ''}`}>
                  <button onClick={() => { onNotificationClick(notif.postId); setIsOpen(false); }} className="w-full text-left p-3 hover:bg-brand-border/50 text-sm">
                    {notif.message}
                  </button>
                </li>
              ))}
            </ul>
          )}
           {notifications.length > 0 && (
            <div className="p-2 border-t border-brand-border">
                <button onClick={onClearNotifications} className="w-full text-center text-xs py-1 text-brand-accent-start hover:underline">Clear All</button>
            </div>
           )}
        </div>
      )}
    </div>
  );
};


interface SidebarProps {
  currentUser: User;
  onSwitchUser: (userId: number) => void;
  notifications: Notification[];
  onNotificationClick: (postId: string) => void;
  onClearNotifications: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onSwitchUser, notifications, onNotificationClick, onClearNotifications }) => {
  return (
    <aside className="w-64 bg-brand-sidebar p-4 flex flex-col flex-shrink-0">
        <div className="flex items-center space-x-2 mb-8">
             <div className="p-2 bg-gradient-to-r from-brand-accent-start to-brand-accent-end rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
             </div>
             <h1 className="text-2xl font-bold text-brand-text">InstaGuard</h1>
        </div>

        <nav className="flex flex-col space-y-2">
            <button className="p-2 rounded-lg bg-brand-card w-full flex items-center space-x-3 text-brand-text">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span className="font-semibold">Home</span>
            </button>
            {currentUser.id === 1 && <NotificationBell notifications={notifications} onNotificationClick={onNotificationClick} onClearNotifications={onClearNotifications}/>}
        </nav>

        <div className="mt-auto">
            <div className="p-3 bg-brand-card/50 rounded-lg">
                 <p className="text-xs text-brand-text-secondary mb-2">Switch Account</p>
                 <div className="space-y-2">
                    {USERS.map(user => (
                    <button
                        key={user.id}
                        onClick={() => onSwitchUser(user.id)}
                        className={`w-full text-left flex items-center space-x-3 p-2 rounded-md transition-colors ${currentUser.id === user.id ? 'bg-brand-accent-start/20 text-brand-text' : 'text-brand-text-secondary hover:bg-brand-card'}`}
                    >
                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full"/>
                        <span className="font-semibold text-sm">{user.name}</span>
                    </button>
                    ))}
                 </div>
            </div>
        </div>

    </aside>
  );
};

export default Sidebar;