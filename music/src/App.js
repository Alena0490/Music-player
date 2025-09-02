import { useState } from "react";
import OneSong from "./components/OneSong";
import data from "./data";

const App = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSong = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };
 
  return (
    <section className="app-wrap">
      <OneSong song={data[currentIndex]} prevSong={prevSong} nextSong={nextSong} />
    </section>
  )
}

export default App