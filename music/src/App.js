import { useState } from "react";
import OneSong from "./components/OneSong";
import data from "./data";

const App = () => {

const [currentIndex, setCurrentIndex] = useState(0);
const [playedSongs, setPlayedSongs] = useState([]);
      //Play order
    const [replay, setReplay] = useState(false);
    const [shuffle, setShuffle] = useState(false);
  

  const prevSong = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const nextSong = () => {
  setCurrentIndex((prev) => {
    if (shuffle) {
      // všechny přehrané?
      if (playedSongs.length === data.length) {
        if (replay) {
          // reset pro opakování
          setPlayedSongs([]);
        } else {
          return prev; // stop
        }
      }

      // available tracks
      const available = data
        .map((_, i) => i)
        .filter((i) => !playedSongs.includes(i));

      const randomIndex = available[Math.floor(Math.random() * available.length)];

      setPlayedSongs([...playedSongs, randomIndex]);

      return randomIndex;
    } else {
      // play in order
      if (prev === data.length - 1) {
        return replay ? 0 : prev;
      }
      return prev + 1;
    }
  });
};

  /** Play order */
      /*** playorder */
    //repeat
    const toggleReplay = (e) => {
        console.log(e)
        setReplay(prev => !prev);
    }

//shuffle
    const toggleShuffle = (e) => {
        console.log(e)
        setShuffle(prev => !prev);    
    }
 
  return (
    <section className="app-wrap">
      <OneSong 
        song={data[currentIndex]} 
        prevSong={prevSong} 
        nextSong={nextSong} 
        replay={replay} 
        shuffle={shuffle} 
        toggleReplay={toggleReplay} 
        toggleShuffle={toggleShuffle}
      />
    </section>
  )
}

export default App