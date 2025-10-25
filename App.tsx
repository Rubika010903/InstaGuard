import React, { useState } from 'react';
import Sidebar from './components/Header';
import UserProfile from './components/UserProfile';
import Modal from './components/Modal';
import ScenarioHelper from './components/ScenarioHelper';
import { USERS, INITIAL_POSTS } from './constants';
import { User, Post, Notification, ForgeryAnalysis, ScenarioStage } from './types';
import { runForgeryDetectionProcess } from './services/geminiService';

type ProcessStage = 'analyzing' | 'complete' | null;

const Spinner: React.FC<{text: string}> = ({text}) => (
    <div className="flex flex-col items-center justify-center space-y-3 py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent-start"></div>
        <span className="text-lg font-semibold text-brand-text-secondary">{text}</span>
    </div>
);

const AnalysisResult: React.FC<{analysis: ForgeryAnalysis}> = ({ analysis }) => {
    const sections = [
        { title: "Cyber Vaccinator Module", content: analysis.vaccinator, icon: "🛡️" },
        { title: "Forgery Detector Phase", content: analysis.detector, icon: "🔍" },
        { title: "Self Recovery Phase", content: analysis.recovery, icon: "🔄" },
        { title: "Quality Assurance", content: analysis.assurance, icon: "✅" },
    ];
    return (
        <div className="space-y-4">
            {sections.map(section => (
                 <div key={section.title} className="bg-brand-sidebar/60 p-4 rounded-lg border border-brand-border">
                    <h3 className="text-lg font-bold text-brand-text flex items-center space-x-2 mb-2">
                        <span>{section.icon}</span>
                        <span>{section.title}</span>
                    </h3>
                    <p className="text-brand-text-secondary leading-relaxed">{section.content}</p>
                </div>
            ))}
        </div>
    );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStage, setProcessStage] = useState<ProcessStage>(null);
  const [analysisResult, setAnalysisResult] = useState<ForgeryAnalysis | null>(null);
  const [activePostForModal, setActivePostForModal] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [scenarioStage, setScenarioStage] = useState<ScenarioStage>('awaiting_alice_post');

  const handleSwitchUser = (userId: number) => {
    const user = USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const handleImageUpload = async (imageBase64: string, caption: string) => {
    if (currentUser.id === 2 && scenarioStage === 'awaiting_bob_tamper') {
        const alicePosts = posts.filter(p => p.userId === 1).sort((a, b) => b.timestamp - a.timestamp);
        const originalPost = alicePosts[0];

        if (!originalPost) {
            setError("Could not find Alice's original post to analyze against.");
            setIsProcessing(true);
            return;
        }

        setActivePostForModal(originalPost);
        setIsProcessing(true);
        setProcessStage('analyzing');
        setError(null);
        
        try {
            const analysis = await runForgeryDetectionProcess(originalPost.imageUrl, imageBase64);
            setAnalysisResult(analysis);

            const newTamperedPost: Post = {
                id: `post_tampered_${Date.now()}`,
                userId: 2,
                imageUrl: imageBase64,
                caption: caption,
                timestamp: Date.now(),
                isTampered: true,
                originalPostId: originalPost.id,
                analysis: analysis,
            };
            setPosts(prev => [newTamperedPost, ...prev]);

            const newNotification: Notification = {
                id: `notif_${Date.now()}`,
                message: `${USERS[1].name} posted a tampered version of your image.`,
                postId: newTamperedPost.id,
                read: false,
            };
            setNotifications(prev => [newNotification, ...prev]);
            setProcessStage('complete');
            setScenarioStage('awaiting_alice_notification_check');

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setProcessStage(null);
        }
    } else {
        const newPost: Post = {
          id: `post_${Date.now()}`,
          userId: currentUser.id,
          imageUrl: imageBase64,
          caption,
          timestamp: Date.now(),
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);

        if (currentUser.id === 1 && scenarioStage === 'awaiting_alice_post') {
            setScenarioStage('awaiting_bob_tamper');
        }
    }
  };
  
  const handleModalClose = () => {
    setIsProcessing(false);
    setProcessStage(null);
    setAnalysisResult(null);
    setActivePostForModal(null);
    setError(null);
  }

  const handleViewAnalysis = (post: Post) => {
      if(post.analysis){
        setActivePostForModal(post);
        setAnalysisResult(post.analysis);
        setProcessStage('complete');
        setIsProcessing(true);
      }
  };

  const handleNotificationClick = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      handleViewAnalysis(post);
      setNotifications(prev => prev.map(n => n.postId === postId ? {...n, read: true} : n));
      setScenarioStage('complete');
    }
  };
  
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleResetScenario = () => {
    setPosts(INITIAL_POSTS);
    setNotifications([]);
    setScenarioStage('awaiting_alice_post');
    setCurrentUser(USERS[0]);
  }

  const renderModalContent = () => {
    if (error) {
        return <div className="text-red-300 bg-red-900/40 border border-red-500 p-4 rounded-lg">
            <h3 className="font-bold text-red-200">Process Failed</h3>
            <p>{error}</p>
        </div>
    }
    switch (processStage) {
        case 'analyzing':
            return <Spinner text="Analyzing forgery..."/>
        case 'complete':
            return analysisResult ? <AnalysisResult analysis={analysisResult}/> : <p>Analysis complete.</p>;
        default:
            return null;
    }
  };

  const getModalTitle = () => {
    if (activePostForModal?.isTampered) return "Forgery Analysis Report";
    if (processStage === 'complete' && !error) return "Process Complete: Analysis Report";
    return "Forgery Detection in Progress";
  }

  return (
    <div className="flex h-screen bg-brand-bg font-sans overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onClearNotifications={handleClearNotifications}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-transparent bg-clip-text">
              {currentUser.name.split(' ')[0]}'s Feed
            </h1>
            <p className="text-brand-text-secondary mb-6">View and manage image posts.</p>
            <ScenarioHelper 
                stage={scenarioStage}
                currentUser={currentUser}
                onReset={handleResetScenario}
            />
            <div className="mt-8">
              <UserProfile
                user={currentUser}
                posts={posts}
                allUsers={USERS}
                onImageUpload={handleImageUpload}
                onViewAnalysis={handleViewAnalysis}
              />
            </div>
        </div>
      </main>

      <Modal 
        isOpen={isProcessing} 
        onClose={handleModalClose} 
        title={getModalTitle()}
        >
        {renderModalContent()}
      </Modal>

    </div>
  );
};

export default App;