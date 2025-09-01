import "./OneSong.css"
import data from "../data"

const OneSong = () => {
    return (
        <section className="one-song">
            {data.map((song) => (
                <article className="player" key={song.id}>
                    <img src={song.cover} alt={song.songName} />
                    <p className="song">{song.songName}</p>
                    <p className="author">{song.author}</p>

                    <audio controls>
                    <source src={song.track} type="audio/mpeg" />
                    </audio>
                </article>
            ))}
        </section>
    )
}

export default OneSong