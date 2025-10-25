import React, { useRef, useState, useEffect } from 'react';
import { Post as PostType, User } from '../types';
import Post from './Post';
import Modal from './Modal';

interface UserProfileProps {
  user: User;
  posts: PostType[];
  allUsers: User[];
  onImageUpload: (imageBase64: string, caption: string) => void;
  onViewAnalysis: (post: PostType) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UserProfile: React.FC<UserProfileProps> = ({ user, posts, allUsers, onImageUpload, onViewAnalysis }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!fileToUpload) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(fileToUpload);
    setPreviewUrl(objectUrl);
    
    return () => URL.revokeObjectURL(objectUrl);
  }, [fileToUpload]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      setCaption('Enjoying the view!');
    }
  };
  
  const handleModalClose = () => {
    if (isUploading) return;
    setFileToUpload(null);
    setCaption('');
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleConfirmUpload = async () => {
    if (!fileToUpload || !caption.trim()) return;
    setIsUploading(true);
    try {
      const base64 = await fileToBase64(fileToUpload);
      onImageUpload(base64, caption);
      handleModalClose();
    } catch (error) {
      console.error("Error converting file to base64", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const userPosts = posts.filter(p => p.userId === user.id);
  const otherPosts = posts.filter(p => p.userId !== user.id);
  const postsToShow = user.id === 1 ? userPosts : posts;


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsToShow.sort((a,b) => b.timestamp - a.timestamp).map(post => (
          <Post
            key={post.id}
            post={post}
            author={allUsers.find(u => u.id === post.userId)}
            onViewAnalysis={onViewAnalysis}
          />
        ))}
      </div>
       {postsToShow.length === 0 && (
        <div className="text-center py-16">
            <h3 className="text-xl font-semibold">No Posts Yet</h3>
            <p className="text-brand-text-secondary mt-2">Upload an image to get started!</p>
        </div>
      )}

      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <button 
        onClick={() => fileInputRef.current?.click()} 
        className="fixed bottom-8 right-8 bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center space-x-2">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>Upload Image</span>
      </button>

      <Modal 
        isOpen={!!fileToUpload}
        onClose={handleModalClose}
        title="Create New Post"
      >
        <div className="space-y-4">
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-full max-h-96 object-contain rounded-lg bg-brand-sidebar" />
          )}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full p-3 bg-brand-sidebar border border-brand-border rounded-md focus:ring-2 focus:ring-brand-accent-start focus:outline-none"
            rows={3}
          />
          <div className="flex justify-end space-x-3">
            <button 
                onClick={handleModalClose}
                disabled={isUploading}
                className="px-4 py-2 rounded-md bg-brand-card hover:bg-brand-border text-brand-text disabled:opacity-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleConfirmUpload}
                disabled={isUploading || !caption.trim()}
                className="px-5 py-2 rounded-md bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isUploading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserProfile;