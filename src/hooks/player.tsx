import React, { createContext, useCallback, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  file: {
    duration: number;
  };
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play(episode: Episode): void;
};
interface PlayerState {
  episodeList: Episode[];
  currentEpisodeIndex: number;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<PlayerState>({} as PlayerState);

  const play = useCallback((episode: Episode) => {
    setData({ episodeList: [episode], currentEpisodeIndex: 0 });
  }, []);

  return (
    <PlayerContext.Provider value={{ episodeList: data.episodeList, currentEpisodeIndex: 0, play }}>
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = (): PlayerContextData => {
  const playerContextData = useContext(PlayerContext);

  return playerContextData;
};

export { PlayerProvider, usePlayer };
