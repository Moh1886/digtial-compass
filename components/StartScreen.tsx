
import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (prompt: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const popularPrompts = [
      "A lone detective in a rain-slicked cyberpunk city.",
      "A fantasy quest to find a lost dragon's egg.",
      "Surviving on a mysterious, uncharted island after a shipwreck.",
      "Exploring a derelict starship adrift in deep space."
  ];

  const handleStart = () => {
    if (prompt.trim()) {
      onStart(prompt);
    }
  };

  const handlePromptClick = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-wider">
          Gemini <span className="text-cyan-400">Adventure</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Craft your own saga. Describe the adventure you want to begin.
        </p>

        <div className="relative w-full mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g., A sci-fi adventure on a derelict starship..."
            className="w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg p-4 pr-12 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 resize-none h-24"
          />
           <button
                onClick={handleStart}
                disabled={!prompt.trim()}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-white p-2 rounded-full transition-all duration-300 ${
                    prompt.trim() ? 'bg-cyan-600 hover:bg-cyan-500 scale-100' : 'bg-gray-600 scale-90'
                }`}
                aria-label="Start Adventure"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
           </button>
        </div>

        <div className="mb-8">
            <p className="text-gray-400 mb-3">Or choose a starting point:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {popularPrompts.map((p, index) => (
                     <button
                        key={index}
                        onClick={() => handlePromptClick(p)}
                        className="bg-gray-800/50 backdrop-blur-sm text-gray-300 text-left p-3 rounded-lg border border-gray-700 hover:bg-gray-700/70 hover:border-cyan-500 transition-all duration-200"
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
