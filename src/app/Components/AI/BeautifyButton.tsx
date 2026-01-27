'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconSparkles, IconCheck, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { beautifyText } from '@/app/actions/ai-actions';

interface BeautifyButtonProps {
  text: string;
  type: 'title' | 'description' | 'comment';
  onAccept: (improvedText: string) => void;
  className?: string;
}

export default function BeautifyButton({ 
  text, 
  type, 
  onAccept,
  className = ''
}: BeautifyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBeautify = async () => {
    if (!text || text.trim().length === 0) {
      setError('Please enter some text first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await beautifyText(text, type);

      if (result.error) {
        setError(result.error);
      } else if (result.success && result.improved) {
        setSuggestion(result.improved);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (suggestion) {
      onAccept(suggestion);
      setSuggestion(null);
    }
  };

  const handleReject = () => {
    setSuggestion(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Beautify Button */}
      {!suggestion && (
        <Button
          type="button"
          onClick={handleBeautify}
          disabled={loading || !text}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <IconSparkles className="w-4 h-4" />
          {loading ? 'Beautifying...' : 'Beautify with AI'}
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Suggestion Box */}
      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-blue-200 dark:border-blue-800 rounded-lg p-3 bg-blue-50 dark:bg-blue-950"
          >
            <div className="flex items-start gap-2 mb-2">
              <IconSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  AI Suggestion:
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                  {suggestion}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleAccept}
                size="sm"
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
              >
                <IconCheck className="w-4 h-4" />
                Accept
              </Button>
              <Button
                onClick={handleReject}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <IconX className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}