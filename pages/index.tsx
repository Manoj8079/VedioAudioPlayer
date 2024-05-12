// Import required libraries
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { MutableRefObject, useEffect, useRef, ChangeEvent } from "react";
import useVideoPlayer from "../src/hooks/useVideoPlayer";
import {
  BsFillVolumeMuteFill,
  BsFillPlayFill,
  BsFillVolumeUpFill,
  BsFillPauseFill,
  BsFullscreen,
  BsFullscreenExit,
  BsArrowsAngleExpand,
  BsArrowsAngleContract,
  BsSkipStartFill,
  BsSkipEndFill,
} from "react-icons/bs";

export default function Home() {
  const videoElement = useRef<HTMLVideoElement>(null);
  const {
    playerState,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
    togglePlay,
    toggleFullScreen,
    toggleMinimize,
    handleForward,
    handleBackward,
    handleVolumeChange,
    setHoveredVolume,
    playNextMedia,
    playPreviousMedia,
  } = useVideoPlayer(videoElement);

  return (
    <div className="container">
      <div className={`video-wrapper ${playerState.isMinimized ? 'minimized' : ''}`}>
        <video ref={videoElement} style={{ backgroundColor: 'black' }} onTimeUpdate={handleOnTimeUpdate}>
          <source src="/assets/video.mp4" type="video/mp4"></source>
        </video>
        <div className="controls">
          <div className="actions">
            <button onClick={togglePlay}>
              {!playerState.isPlaying ? (
                <BsFillPlayFill color="white" />
              ) : (
                <BsFillPauseFill color="white" />
              )}
            </button>
            <button onClick={playPreviousMedia}>
              <BsSkipStartFill color="white" />
            </button>
            <button onClick={playNextMedia}>
              <BsSkipEndFill color="white" />
            </button>

            <button onClick={handleBackward}>
              <FaAngleDoubleLeft color="white" />
            </button>
            <button onClick={handleForward}>
              <FaAngleDoubleRight color="white" />
            </button>
            
            <div
            className="volume-container"
            onMouseEnter={() => setHoveredVolume(true)}
            onMouseLeave={() => setHoveredVolume(false)}
          > 
          <button onClick={toggleMute}>
              {!playerState.isMuted ? (
                <BsFillVolumeUpFill color="white" />
              ) : (
                <BsFillVolumeMuteFill color="white" />
              )}
            </button>
            {playerState.isMuted || playerState.hoveredVolume ? (
              // <div className="volume">
                <input
                className="volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={playerState.volume}
                onChange={handleVolumeChange}
              />
                // </div>
            ) : null}
          </div>

            <select
              className="velocity"
              value={playerState.speed}
              onChange={handleVideoSpeed}
            >
              <option value="0.50">0.50x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.50">1.50x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
              <option value="2.25">2.25x</option>
              <option value="2.50">2.50x</option>
              <option value="2.75">2.75x</option>
              <option value="3">3x</option>
              <option value="3.25">3.25x</option>
              <option value="3.50">3.50x</option>
              <option value="3.75">3.75x</option>
              <option value="4">4x</option>
            </select>
            <button onClick={toggleMinimize}>
              {playerState.isMinimized ? (
                <BsArrowsAngleExpand color="white" />
              ) : (
                <BsArrowsAngleContract color="white" />
              )}
            </button>
            <button onClick={toggleFullScreen}>
              {playerState.isFullScreen ? (
                <BsFullscreenExit color="white" />
              ) : (
                <BsFullscreen color="white" />
              )}
            </button>

          </div>
          <div >
            <input
              className="progress"
              type="range"
              min="0"
              max="100"
              value={playerState.progress}
              onChange={handleVideoProgress}
            />
          </div>



        </div>
      </div>
    </div>
  );
}
