'use client';

import { useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const FeedbackBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Thank you for your feedback!');
        setFeedback('');
        setIsOpen(false);
      } else {
        throw new Error(data.error || 'Failed to send feedback');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error(error.message || 'Failed to send feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary hover:bg-primary-light text-white rounded-full shadow-lg p-4 z-50"
        aria-label="Give feedback"
      >
        <FaPaperPlane className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-card-bg border-t border-border shadow-lg z-50 animate-slideUp">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium">Have feedback for us?</h3>
          <p className="text-xs text-foreground/70">Help us improve ViteBunny by sharing your thoughts</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex items-center w-full sm:w-auto">
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback..."
            className="flex-1 px-4 py-2 text-sm bg-background border border-border rounded-l-lg focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-light text-white font-medium text-sm px-4 py-2 rounded-r-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Send'
            )}
          </button>
        </form>
        
        <button
          onClick={() => setIsOpen(false)}
          className="text-foreground/70 hover:text-foreground focus:outline-none"
          aria-label="Close feedback"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackBar; 