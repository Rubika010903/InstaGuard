import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div 
        className="bg-brand-card text-brand-text rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 border border-brand-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-brand-card/80 backdrop-blur-sm p-4 border-b border-brand-border flex justify-between items-center z-10">
          <h2 className="text-xl font-bold bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-transparent bg-clip-text">{title}</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;