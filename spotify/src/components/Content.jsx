import React from 'react'

const Content = () => {

    const connectButtonClick = () => {
        run();
        function run(){
            window.location.href = "https://accounts.spotify.com/de/authorize?client_id=38bd7544c7d04364941d952423e3023f&response_type=code&redirect_uri=https%3A%2F%2Fmarceybot.de%2Fspotify%2Fconnect%2F&show_dialog=true&scope=user-read-recently-played%20user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20playlist-modify-public%20playlist-modify-private%20playlist-read-private%20playlist-read-collaborative%20user-read-email%20user-read-private";
        }
    }

  return (
    <div>
        <div className="spotifyLogoContainer">
            <i className='spotifyLogo bx bxl-spotify' />
        </div>
        <div className="spotifyButtonContainer">
            <p className="spotifyText">Du hast Spotify </p><p className="spotifyNotConnectedText">nicht verbunden.</p>
            <p className="spotifyText"> </p>
            <button onClick={connectButtonClick} className="whiteButton connectButton">Verbinden</button>
        </div>
    </div>
  )
}

export default Content