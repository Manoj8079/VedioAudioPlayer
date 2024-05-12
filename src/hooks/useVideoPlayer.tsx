import { useState, useEffect, ChangeEvent, useRef } from "react";

// Types
import { UsePlayerStateType } from "../types";

const useVideoPlayer = (videoElement: any) => {
  const videoElementRef = useRef<HTMLVideoElement>(null);

  const [playerState, setPlayerState] = useState<UsePlayerStateType>({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
    videoLength: 0,
    totalPlayButtonClick: 0,
    totalWatchTime: 0,
    isFullScreen: false,
    isMinimized: false,
    volume: 1,
    hoveredVolume: false,
  });

  const mediaList = [
    "Hanuman.mp4",
    "RCB.mp4",
    "Listen.mp3",
    "React.mp4",
    "video.mp4",
  ];

  const playNextMedia = () => {
    let currentMediaIndex = mediaList.indexOf(videoElement.current.currentSrc.split('/').slice(-1)[0]);
    if (currentMediaIndex !== -1 ) {
      currentMediaIndex=currentMediaIndex===mediaList.length-1?0:currentMediaIndex
      const nextMedia = mediaList[currentMediaIndex + 1];
      videoElement.current.src = `/assets/${nextMedia}`;
      videoElement.current.play();
    }
  };
  
  const playPreviousMedia = () => {
    let currentMediaIndex = mediaList.indexOf(videoElement.current.currentSrc.split('/').slice(-1)[0]);
    if (currentMediaIndex >= 0) {
      currentMediaIndex=currentMediaIndex===0?mediaList.length:currentMediaIndex
      const previousMedia = mediaList[currentMediaIndex - 1];
      videoElement.current.src = `/assets/${previousMedia}`;
      videoElement.current.play();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyN') {
        playNextMedia();
      } else if (event.code === 'KeyP') {
        playPreviousMedia();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playNextMedia, playPreviousMedia]);

  const togglePlay = () => {
    setPlayerState(prevState => ({
      ...prevState,
      totalPlayButtonClick: prevState.totalPlayButtonClick + 1,
      isPlaying: !prevState.isPlaying,
    }));
  };
  const toggleMute = () => {
    setPlayerState(prevState => ({
      ...prevState,
      isMuted: !prevState.isMuted,
    }));
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        togglePlay();
      } else if (event.code === 'KeyM') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay, toggleMute]);

  useEffect(() => {
    playerState.isPlaying ? videoElement.current.play() : videoElement.current.pause();
  }, [playerState.isPlaying, videoElement]);

  useEffect(() => {
    setPlayerState(prevState => ({
      ...prevState,
      videoLength: videoElement.current.duration,
    }));
  }, [videoElement]);

  useEffect(() => {
    videoElement.current.muted = playerState.isMuted;
  }, [playerState.isMuted, videoElement]);

  useEffect(() => {
    let startTime: number;
    let intervalId: NodeJS.Timeout;

    const updateTotalWatchTime = () => {
      if (playerState.isPlaying && startTime !== null) {
        const currentTime = new Date().getTime();
        setPlayerState(prevState => ({
          ...prevState,
          totalWatchTime: prevState.totalWatchTime + (currentTime - startTime),
        }));
        startTime = currentTime;
      }
    };

    if (playerState.isPlaying) {
      startTime = new Date().getTime();
      intervalId = setInterval(updateTotalWatchTime, 1000);
    } else {
      updateTotalWatchTime();
    }

    return () => clearInterval(intervalId);
  }, [playerState.isPlaying]);

  const handleOnTimeUpdate = () => {
    const progress = (videoElement.current.currentTime / videoElement.current.duration) * 100;
    setPlayerState(prevState => ({
      ...prevState,
      progress,
    }));
  };

  const handleVideoProgress = (event: any) => {
    const manualChange: number = Number(event.target.value);
    videoElement.current.currentTime = (videoElement.current.duration / 100) * manualChange;
    setPlayerState(prevState => ({
      ...prevState,
      progress: manualChange,
    }));
  };

  const handleVideoSpeed = (event: any) => {
    const speed: number = Number(event.target.value);
    videoElement.current.playbackRate = speed;
    setPlayerState(prevState => ({
      ...prevState,
      speed,
    }));
  };



  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyM') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleMute]);

  const toggleFullScreen = () => {
    const videoWrapper = document.querySelector('.video-wrapper') as HTMLElement;
    const contentWrapper = document.querySelector('.container') as HTMLElement;
    if (!playerState.isFullScreen) {
      const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
        mozRequestFullScreen(): Promise<void>;
        webkitRequestFullscreen(): Promise<void>;
        msRequestFullscreen(): Promise<void>;
      };

      if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
        docElmWithBrowsersFullScreenFunctions.requestFullscreen();
      } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) {
        docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
      } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) {
        docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
      } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) {
        docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
      }
      videoWrapper.style.width = '100%';
      videoWrapper.style.height = '100%';
    } else {
      const documentRef = document as any;
      if (documentRef.exitFullscreen) {
        documentRef.exitFullscreen();
      } else if (documentRef.mozCancelFullScreen) {
        documentRef.mozCancelFullScreen();
      } else if (documentRef.webkitExitFullscreen) {
        documentRef.webkitExitFullscreen();
      } else if (documentRef.msExitFullscreen) {
        documentRef.msExitFullscreen();
      }
      videoWrapper.style.width = '';
      videoWrapper.style.height = '';
    }
    setPlayerState(prevState => ({
      ...prevState,
      isFullScreen: !prevState.isFullScreen,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyF') {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullScreen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && playerState.isFullScreen) {
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullScreen, playerState.isFullScreen]);

  const toggleMinimize = () => {
    setPlayerState(prevState => ({
      ...prevState,
      isMinimized: !prevState.isMinimized,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyW') {
        toggleMinimize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleMinimize]);

  const handleForward = () => {
    videoElement.current.currentTime += 10;
  };

  const handleBackward = () => {
    videoElement.current.currentTime -= 10;
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const volume: number = parseFloat(event.target.value);
    videoElement.current.volume = volume;
    setPlayerState(prevState => ({
      ...prevState,
      volume: volume,
    }));
  };

  const handleVolumeButtonHover = (isHovered: boolean) => {
    setPlayerState((prevState) => ({
      ...prevState,
      hoveredVolume: isHovered,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (playerState.hoveredVolume) {
        // Adjust volume with up and down arrow keys
        if (event.code === 'ArrowUp') {
          const newVolume = Math.min(playerState.volume + 0.1, 1);
          videoElement.current.volume = newVolume;
          setPlayerState(prevState => ({
            ...prevState,
            volume: newVolume,
          }));
        } else if (event.code === 'ArrowDown') {
          const newVolume = Math.max(playerState.volume - 0.1, 0);
          videoElement.current.volume = newVolume;
          setPlayerState(prevState => ({
            ...prevState,
            volume: newVolume,
          }));
        }
      } else {
        // Seek video with left and right arrow keys
        if (event.code === 'ArrowRight') {
          handleForward();
        } else if (event.code === 'ArrowLeft') {
          handleBackward();
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleForward, handleBackward, playerState.volume, playerState.hoveredVolume]);
  


  return {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    toggleFullScreen,
    toggleMinimize,
    handleForward,
    handleBackward,
    handleVolumeChange,
    setHoveredVolume: handleVolumeButtonHover,
    videoElementRef,
    playNextMedia,
    playPreviousMedia,
  };
};

export default useVideoPlayer;
