import { useState, useEffect } from "react";
import OneSong from "./components/OneSong";
import data from "./data";
import jsmediatags from "jsmediatags/dist/jsmediatags.min.js";

const App = () => {

const [currentIndex, setCurrentIndex] = useState(0);
const [playedSongs, setPlayedSongs] = useState([]);

  // Load uploaded songs
  const [uploadedSongs, setUploadedSongs] = useState(() => {
    const saved = localStorage.getItem("uploadedSongs");
    return saved ? JSON.parse(saved) : [];
});

    //Play order
    const [replay, setReplay] = useState(false);
    const [shuffle, setShuffle] = useState(false);

    //Add new song
 //Add new song
const handleUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);

  jsmediatags.read(file, {
      onSuccess: (tag) => {
        const { title, artist, album } = tag.tags;

        let coverUrl = "fallback.jpg";
        if (tag.tags.picture) {
          const { data, format } = tag.tags.picture;
          const byteArray = new Uint8Array(data);
          const blob = new Blob([byteArray], { type: format });
          coverUrl = URL.createObjectURL(blob);
        }

        const newSong = {
          id: Date.now(),
          songName: title || file.name,
          author: artist || "Unknown",
          album: album || "Unknown Album",
          cover: coverUrl,
          track: url,
          isUploaded: true,
        };

        setUploadedSongs((prev) => [...prev, newSong]);
        setCurrentIndex(data.length + uploadedSongs.length);
      },
      onError: (error) => {
        console.log("Chyba při čtení metadat:", error);

        const newSong = {
          id: Date.now(),
          songName: file.name,
          author: "Unknown",
          cover: "/fallback2.webp",
          track: url,
          isUploaded: true,
        };

        setUploadedSongs((prev) => [...prev, newSong]);
        setCurrentIndex(data.length + uploadedSongs.length);
      },
    });
  };

const allSongs = [...data, ...uploadedSongs];

// Save changes 
useEffect(() => {
  // save changes immidiately
  localStorage.setItem("uploadedSongs", JSON.stringify(uploadedSongs));
}, [uploadedSongs]);

// Delete song 
const removeUploadedSong = (id) => {
  setUploadedSongs((prev) => prev.filter((song) => song.id !== id));
  // If the currently played song is deletet switch to the first one
  if (allSongs[currentIndex]?.id === id) {
    setCurrentIndex(0);
  }
};

// Switching between sogs
  const prevSong = () => {
    setCurrentIndex((prev) => (prev === 0 ? allSongs.length - 1 : prev - 1));
  };

  const nextSong = () => {
  setCurrentIndex((prev) => {
    if (shuffle) {
      // všechny přehrané?
      if (playedSongs.length === allSongs.length) {
        if (replay) {
          // reset pro opakování
          setPlayedSongs([]);
        } else {
          return prev; // stop
        }
      }

      // available tracks
      const available = allSongs
        .map((_, i) => i)
        .filter((i) => !playedSongs.includes(i));

      const randomIndex = available[Math.floor(Math.random() * available.length)];

      setPlayedSongs([...playedSongs, randomIndex]);

      return randomIndex;
    } else {
      // play in order
      if (prev === allSongs.length - 1) {
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
        song={allSongs[currentIndex]} 
        prevSong={prevSong} 
        nextSong={nextSong} 
        replay={replay} 
        shuffle={shuffle} 
        toggleReplay={toggleReplay} 
        toggleShuffle={toggleShuffle}
        handleUpload={handleUpload}
        removeUploadedSong={removeUploadedSong}
      />
    </section>
  )
}

export default App