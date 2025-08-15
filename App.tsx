
import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import type { CurrentScene } from './types';
import { generateScene, generateImage } from './services/geminiService';

import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.START);
    const [currentScene, setCurrentScene] = useState<CurrentScene | null>(null);
    const [storyHistory, setStoryHistory] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    const handleRestart = () => {
        setGameState(GameState.START);
        setCurrentScene(null);
        setStoryHistory('');
        setError(null);
    };

    const processNewScene = useCallback(async (prompt: string, currentHistory: string) => {
        try {
            setLoadingMessage('The storyteller is pondering your fate...');
            const sceneData = await generateScene(prompt, currentHistory);
            
            setLoadingMessage('A vision of your world is materializing...');
            const imageUrl = await generateImage(sceneData.imagePrompt);

            const newHistory = `${currentHistory}\n\n> ${prompt}\n\n${sceneData.story}`;
            setStoryHistory(newHistory);
            
            setCurrentScene({ ...sceneData, imageUrl });
            setGameState(GameState.PLAYING);
            setError(null);
        } catch (err) {
            console.error(err);
            const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred.";
            setError(`There was a tear in the fabric of reality... (${errorMessage}). Please try starting a new adventure.`);
            setGameState(GameState.ERROR);
        }
    }, []);

    const handleStart = useCallback(async (prompt: string) => {
        setGameState(GameState.LOADING);
        await processNewScene(prompt, '');
    }, [processNewScene]);

    const handleChoice = useCallback(async (choice: string) => {
        setGameState(GameState.LOADING);
        await processNewScene(choice, storyHistory);
    }, [processNewScene, storyHistory]);

    const renderContent = () => {
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen text-center text-red-400 p-4">
                    <h2 className="text-2xl font-bold mb-4">An Error Occurred</h2>
                    <p className="max-w-md mb-6">{error}</p>
                    <button
                        onClick={handleRestart}
                        className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-transform duration-200 hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        switch (gameState) {
            case GameState.START:
                return <StartScreen onStart={handleStart} />;
            case GameState.LOADING:
                return (
                    <div className="flex items-center justify-center min-h-screen">
                        <LoadingSpinner message={loadingMessage} />
                    </div>
                );
            case GameState.PLAYING:
                if (currentScene) {
                    return <GameScreen scene={currentScene} onChoice={handleChoice} onRestart={handleRestart} />;
                }
                return null; // Should not happen
            case GameState.ERROR:
                // This state is handled by the error check at the top
                return null;
            default:
                return <StartScreen onStart={handleStart} />;
        }
    };

    return (
        <main className="bg-gray-900 text-white font-sans">
            {renderContent()}
        </main>
    );
};

export default App;
