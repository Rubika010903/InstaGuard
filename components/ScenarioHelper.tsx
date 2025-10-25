import React from 'react';
import { User, ScenarioStage } from '../types';

interface ScenarioHelperProps {
  stage: ScenarioStage;
  currentUser: User;
  onReset: () => void;
}

const getInstructions = (stage: ScenarioStage, currentUser: User): { title: string; description: string; highlight: boolean } => {
  const isAlice = currentUser.id === 1;

  switch (stage) {
    case 'awaiting_alice_post':
      return {
        title: 'Step 1: Post an Image as Alice',
        description: isAlice
          ? "You are logged in as Alice. Click the 'Upload Image' button to post a picture."
          : "Please switch to Alice's account to begin the simulation.",
        highlight: isAlice,
      };
    case 'awaiting_bob_tamper':
      return {
        title: 'Step 2: Tamper the Image as Bob',
        description: isAlice
          ? "Image posted! Now, switch to Bob's account to simulate the tampering."
          : "You are Bob. Upload your manually tampered version of Alice's latest image.",
        highlight: !isAlice,
      };
    case 'awaiting_alice_notification_check':
      return {
        title: 'Step 3: Check Notification as Alice',
        description: isAlice
          ? "A tampered version of your post was detected! Click the notification bell to view the forgery report."
          : "Tampering successful! Switch back to Alice's account to see the result.",
        highlight: isAlice,
      };
    case 'complete':
      return {
        title: 'Simulation Complete!',
        description: 'You have successfully walked through the forgery detection and recovery simulation.',
        highlight: true,
      };
    default:
      return { title: '', description: '', highlight: false };
  }
};

const ScenarioHelper: React.FC<ScenarioHelperProps> = ({ stage, currentUser, onReset }) => {
  const { title, description, highlight } = getInstructions(stage, currentUser);

  return (
    <div className={`bg-brand-card/70 border ${highlight ? 'border-brand-accent-start/80' : 'border-brand-border'} rounded-lg p-4 shadow-lg transition-all`}>
      <div className="flex justify-between items-start">
          <div>
              <h2 className="text-lg font-bold text-brand-text mb-1">{title}</h2>
              <p className="text-brand-text-secondary">{description}</p>
          </div>
          {stage === 'complete' && (
              <button 
                  onClick={onReset}
                  className="ml-4 bg-gradient-to-r from-brand-accent-start to-brand-accent-end text-white font-semibold py-1 px-3 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                  Reset Scenario
              </button>
          )}
      </div>
    </div>
  );
};

export default ScenarioHelper;