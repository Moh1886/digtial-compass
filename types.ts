
export enum GameState {
    START,
    LOADING,
    PLAYING,
    ERROR
}

export interface Scene {
    story: string;
    imagePrompt: string;
    choices: string[];
}

export interface CurrentScene extends Scene {
    imageUrl: string;
}
