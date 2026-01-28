import React, { createContext, useContext, useState } from 'react';

interface Playlist {
    id: string;
    name: string;
}

interface MusicContextType {
    playingPlaylist: Playlist | null;
    isPlayerVisible: boolean;
    isMinimized: boolean;
    playPlaylist: (playlist: Playlist) => void;
    minimizePlayer: () => void;
    expandPlayer: () => void;
    stopMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [playingPlaylist, setPlayingPlaylist] = useState<Playlist | null>(null);
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const playPlaylist = (playlist: Playlist) => {
        setPlayingPlaylist(playlist);
        setIsPlayerVisible(true);
        setIsMinimized(false);
    };

    const minimizePlayer = () => {
        setIsMinimized(true);
        setIsPlayerVisible(false);
    };

    const expandPlayer = () => {
        setIsMinimized(false);
        setIsPlayerVisible(true);
    };

    const stopMusic = () => {
        setPlayingPlaylist(null);
        setIsPlayerVisible(false);
        setIsMinimized(false);
    };

    return (
        <MusicContext.Provider value={{
            playingPlaylist,
            isPlayerVisible,
            isMinimized,
            playPlaylist,
            minimizePlayer,
            expandPlayer,
            stopMusic
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};
