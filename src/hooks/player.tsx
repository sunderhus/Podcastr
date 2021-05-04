import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Episode {
  title: string;
  members: string;
  thumbnail: string;
  file: {
    duration: number;
    url: string;
  };
}

interface PlayerContextData {
  episodesList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play(episode: Episode): void;
  togglePlay(): void;
  toggleLoop(): void;
  toggleShuffle(): void;
  playPrevious(): void;
  playNext(): void;
  setIsPlayingState(state: boolean): void;
  playList(list: Episode[], index: number): void;
}

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

const PlayerProvider: React.FC = ({ children }) => {
  const [episodesList, setEpisodesList] = useState<Episode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(() => {
    return currentEpisodeIndex !== 0;
  });
  const [hasNext, setHasNext] = useState(() => {
    return currentEpisodeIndex !== episodesList.length;
  });

  const play = useCallback((episode: Episode) => {
    setCurrentEpisodeIndex(0);
    setEpisodesList([episode]);
    setIsPlaying(true);
  }, []);

  const playList = useCallback((list: Episode[], index: number) => {
    setEpisodesList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(currentState => !currentState);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping(currentState => !currentState);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(currentState => !currentState);
  }, []);

  const setIsPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  const playNext = useCallback(() => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodesList.length,
      );
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }, [currentEpisodeIndex, episodesList.length, hasNext, isShuffling]);

  const playPrevious = useCallback(() => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodesList.length,
      );
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasPrevious) {
      const previousEpisodeList = currentEpisodeIndex - 1;
      setCurrentEpisodeIndex(previousEpisodeList);
    }
  }, [currentEpisodeIndex, episodesList.length, hasPrevious, isShuffling]);

  useEffect(() => {
    const hasPreviousEpisode = currentEpisodeIndex > 0;
    const hasNextEpisode = currentEpisodeIndex + 1 < episodesList.length;

    setHasPrevious(hasPreviousEpisode);
    setHasNext(hasNextEpisode);
  }, [currentEpisodeIndex, episodesList.length, isShuffling]);

  return (
    <PlayerContext.Provider
      value={{
        episodesList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        play,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setIsPlayingState,
        playList,
        playPrevious,
        playNext,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

const usePlayer = (): PlayerContextData => {
  const playerContextData = useContext(PlayerContext);

  return playerContextData;
};

export { PlayerProvider, usePlayer };
