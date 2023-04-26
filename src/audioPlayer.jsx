import React, { useEffect, useRef, useState } from "react";

function AudioPlayer() {
  const [songs, setSongs] = useState([]);
  const songRef = useRef(0);
  const [currentSongsIndex, setCurrentSongsIndex] = useState(0);
  const [PlaySong, setPlaySong] = useState(false);
  const [currentPlayingTime, setCurrentPlayingTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);

  useEffect(() => {
    fetch("https://assets.breatheco.de/apis/sound/songs")
      .then((response) => response.json())
      .then((data) => setSongs(data));
  }, []);

  function handleChooseSongs(song) {
    const currentSongUrl =
      "https://assets.breatheco.de/apis/sound/songs/" + song.url;
    const songsIndex = songs.findIndex((i) => i.name === song.name);
    setCurrentSongsIndex(songsIndex);
    songRef.current.src = currentSongUrl;
    songRef.current.play().catch((error) => console.error(error));
    setPlaySong(true);
  }

  function handleNextSong() {
    setCurrentSongsIndex((currentSongsIndex + 1) % songs.length);
    setPlaySong(false);
  }

  function handlePreviusSong() {
    setCurrentSongsIndex(currentSongsIndex === 0 ? songs.length - 1 : currentSongsIndex - 1)
    setPlaySong(false);
  }

  function handleOnTimeUpdate() {
    setCurrentPlayingTime(songRef.current.currentPlayingTime);
    setSongDuration(songRef.current.songDuration);
  }

  function handlePlayPause() {
    if (PlaySong) {
      songRef.current.pause();
    } else {
      songRef.current.play();
    }
    setPlaySong(!PlaySong);
  }

  return (
    <>
      <div className="audio-player bg-dark">
        <audio
          ref={songRef}
          src={`https://assets.breatheco.de/apis/sound/${songs[currentSongsIndex]?.url}`}
          onEnded={handleNextSong}
          onTimeUpdate={handleOnTimeUpdate}
          autoPlay="autoPlay"
        />
        <ol>
          {songs.map((songs, songsIndex) => (
            <li
              key={`${songs.id}-${songs.name}`}
              onClick={() => handleChooseSongs(songs)}
              className= {"m-3 border-bottom song"+ (songsIndex === currentSongsIndex ? " text-success" : " text-light")}
            >
              {songs.name}
            </li>
          ))}
        </ol>
      </div>
      <div className="bg-dark bg-gradient d-flex justify-content-center sticky-bottom">
        <button type="button" className="btn btn-dark bg-dark bg-gradient" onClick={handlePreviusSong}><i className="fa-solid fa-forward fa-rotate-180"></i></button>
        <button type="button" className="btn btn-dark bg-dark bg-gradient" onClick={handlePlayPause}><i className="fa-solid fa-play text-white"></i></button>
        <button type="button" className="btn btn-dark bg-dark bg-gradient" onClick={handleNextSong}><i className="fa-solid fa-forward"></i></button>
      </div>
    </>
  );
}
export default AudioPlayer;