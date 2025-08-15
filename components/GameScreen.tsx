
import React from 'react';
import type { CurrentScene } from '../types';

interface GameScreenProps {
  scene: CurrentScene;
  onChoice: (choice: string) => void;
  onRestart: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ scene, onChoice, onRestart }) => {
  const isEndGame = scene.choices.length === 0;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-4 pt-8 md:pt-12">
        <div className="max-w-4xl w-full">
            <div className="mb-6 w-full aspect-video rounded-lg overflow-hidden shadow-2xl shadow-black/50 border-2 border-gray-700">
                {scene.imageUrl ? (
                    <img 
                        src={scene.imageUrl} 
                        alt="Scene visual" 
                        className="w-full h-full object-cover animate-fade-in"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <p className="text-gray-400">Loading image...</p>
                    </div>
                )}
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg border border-gray-700 shadow-lg">
                <p className="text-gray-200 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                    {scene.story}
                </p>

                {isEndGame ? (
                     <div className="text-center">
                        <p className="text-cyan-400 font-bold text-2xl mb-4">The End</p>
                        <button
                            onClick={onRestart}
                            className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-transform duration-200 hover:scale-105"
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {scene.choices.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => onChoice(choice)}
                                className="bg-gray-700 text-white text-left font-semibold p-4 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-200 transform hover:-translate-y-1"
                            >
                                {choice}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default GameScreen;
