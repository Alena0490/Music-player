import "./OneSong.css"
import { useRef, useState, useEffect, useCallback  } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa6";
import { BsFillSkipForwardFill, BsSkipBackwardFill } from "react-icons/bs";

const OneSong = ({ song, prevSong, nextSong }) => {
    
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.6);
    const progressSliderRef = useRef(null); // přidáno

    /** Progress bar update (thumb + barva) */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let frameId;

        const updateProgress = () => {
            if (audio.duration) {
                const newProgress = (audio.currentTime / audio.duration) * 100 || 0;
                setProgress(newProgress);
            }

            frameId = requestAnimationFrame(updateProgress); 
        };

        if (isPlaying) {
            frameId = requestAnimationFrame(updateProgress);
        }

        return () => cancelAnimationFrame(frameId);
    }, [isPlaying, song]);

    // Aktualizace CSS proměnné pro progress slider
    useEffect(() => {
        if (progressSliderRef.current) {
            progressSliderRef.current.style.setProperty("--progress", `${progress}%`);
        }
    }, [progress]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        setIsPlaying(prev => {
            if (prev) {
                audio.pause();
            } else {
                audio.play();
            }
            return !prev; // nový stav
        });
    },[]);

    /*** Set Progress bar to 0 */
    const handleProgressChange = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const value = e.target.value;
        const newTime = (value / 100) * audio.duration;

        audio.currentTime = newTime;
        setProgress(value);

        // Odebrána okamžitá aktualizace CSS proměnné
        // CSS proměnná se nyní aktualizuje v useEffect
    };

    /** Volume  */
    const handleVolumeChange = (e) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newVolume = e.target.value / 100;
        audio.volume = newVolume;
        setVolume(newVolume);
    };

    /** Play another song */
    /** Při změně skladby + po skončení */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        //keep volume
        audio.volume = volume;

        // reset při změně songu
        setProgress(0);
        audio.currentTime = 0;

        // pokud se má hrát, spustit
        if (isPlaying) {
            audio.play();
        }

        // přechod na další song po skončení
        const handleEnded = () => {
            nextSong();
        };

        audio.addEventListener("ended", handleEnded);
        return () => audio.removeEventListener("ended", handleEnded);
    }, [song, isPlaying, nextSong, volume]);

    /***KEYBOARD SHORTCUTS  */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleKeyDown = (e) => {
            switch (e.code) {
            case "Space":             // mezerník
                e.preventDefault();     // zabrání scrollování stránky
                togglePlay();           // play/pause
                break;
            case "ArrowRight":        // šipka doprava
                audio.currentTime += 5; // posun vpřed o 5s
                break;
            case "ArrowLeft":         // šipka doleva
                audio.currentTime -= 5; // posun zpět o 5s
                break;
            case "ArrowUp":           // šipka nahoru
                setVolume(v => Math.min(1, v + 0.1)); // zvýšení hlasitosti
                audio.volume = Math.min(1, volume + 0.1);
                break;
            case "ArrowDown":         // šipka dolů
                setVolume(v => Math.max(0, v - 0.1)); // snížení hlasitosti
                audio.volume = Math.max(0, volume - 0.1);
                break;
            case "KeyM":              // M = mute/unmute
                if (audio.volume > 0) {
                setVolume(0);
                audio.volume = 0;
                } else {
                setVolume(0.6); // třeba výchozí hlasitost
                audio.volume = 0.6;
                }
                break;
            default:
                break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [togglePlay, volume]);

    /* Focus ring - progress */
    //progress
    const handleProgressKey = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (e.key === "ArrowLeft") {
            e.preventDefault(); // nové
            const newValue = Math.max(0, progress - 5); // posun o 5%
            setProgress(newValue);
            audio.currentTime = (newValue / 100) * audio.duration;
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            const newValue = Math.max(0, progress + 5); // posun o 5%// krok vpřed
            setProgress(newValue);
            audio.currentTime = (newValue / 100) * audio.duration;
        }
    };

    //Volume
    const handleVolumeKey = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (e.key === "ArrowDown") {
            const newVolume = Math.max(0, volume - 0.05); // -5 %
            setVolume(newVolume);
            audio.volume = newVolume;
        }

        if (e.key === "ArrowUp") {
            const newVolume = Math.min(1, volume + 0.05); // +5 %
            setVolume(newVolume);
            audio.volume = newVolume;
        }
    };

    /*** Time  */
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <section className="one-song" role="group" aria-label="Music player">
            <article className="player" key={song.id}>
                <img className="song-cover" src={song.cover} alt={song.songName} />
                <p className="song" aria-live="polite">{song.songName}</p>
                <p className="author" aria-live="polite">{song.author}</p>

            <div className="audio-box">
                 <audio ref={audioRef} src={song.track}></audio>

                <div className="controls">
                    <div className="buttons">
                         <button 
                            onClick={prevSong}
                            aria-label="Previous track">
                                <BsSkipBackwardFill />
                        </button>
                        <button 
                            className="play"
                            onClick={togglePlay}
                            aria-label={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? <FaPause /> : <FaPlay />}

                        </button>
                        <button 
                            onClick={nextSong}
                            aria-label="Next track">
                                <BsFillSkipForwardFill />
                        </button>
                    </div>
                    <div className="volume-slider">
                        <FaVolumeMute />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            tabIndex="0"
                            value={volume * 100}
                            onChange={handleVolumeChange}
                            onKeyDown={handleVolumeKey}
                            className="volume-slider-input"
                            aria-label="Set volume"
                            aria-valuemin={0}
                            aria-valuemax="100"
                            aria-valuenow={Math.round(volume * 100)}  
                            style={{ "--progress": `${volume * 100}%` }}
                        />
                        <FaVolumeUp />
                    </div>                 
                </div>

                <input
                    ref={progressSliderRef} // přidán ref
                    type="range"
                    value={progress}
                    onChange={handleProgressChange}
                    onKeyDown={handleProgressKey}
                    min="0"
                    max="100"
                    step="0.1"
                    tabIndex="0"
                    className="progress-slider"
                    aria-label="Track progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={Math.round(progress)}
                    aria-valuetext={`${Math.floor(audioRef.current?.currentTime / 60) || 0}:${String(Math.floor(audioRef.current?.currentTime % 60) || 0).padStart(2,"0")}`}
                    style={{ "--progress": `${progress}%` }} // zůstává pro iniciální nastavení
                />
                <p className="time">
                    {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioRef.current?.duration || 0)}
                </p>
            </div>
            </article>
        </section>
    )
}

export default OneSong