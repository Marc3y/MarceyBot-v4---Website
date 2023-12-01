import React from 'react'
import { updateAITTSStatus } from '../script/servermanager';
import { TwitchUserId } from '../script/twitch';

const Content = () => {

  const toggleTTSCommands = () => {
    run();
    function run(){
      updateAITTSStatus("commands", document.querySelector(".commandsEnabled").textContent === "Aktivieren" ? "true" : "false");
    }
  };
  const toggleTTSChannelPoints = () => {
    run();
    function run(){
      updateAITTSStatus("channelpoints", document.querySelector(".channelpointsEnabled").textContent === "Aktivieren" ? "true" : "false");
    }
  };

  const copyLink = () => {
    run();
    function run(){
      navigator.clipboard.writeText("https://marceybot.de/aitts/overlay/?channelId=" + TwitchUserId);
    }
  }

  return (
    <div className="container">
        <p className="title">AI TTS</p>
        <ul className="tabContainer">

        <li className="tabOption commandsO enabled">
        <p className="tabOptionP">Über Commands</p>
        <div className="border" />
        </li>

        <li className="tabOption channelpointsO">
        <p className="tabOptionP">Über ChannelPoints</p>
        <div className="border" />
        </li>

        <li className="tabOption donationsO">
        <p className="tabOptionP">Über Donations</p>
        <div className="border" />
        </li>
        </ul>

        <div className="commands enabled">
          <a className="importantInformation" href="https://marceybot.de/aitts-information/" target="_blank">Wichtige Information<i className='importantInformationI bx bx-link-external'></i></a>
          <p className="description">Commands: !aitts, !tts</p>
          <button className="copyLink" onClick={copyLink}>Overlay-Link kopieren</button>
          <button onClick={toggleTTSCommands} className="enableButton commandsEnabled">Aktivieren</button>
        </div>

        <div className="channelpoints">
          <a className="importantInformation" href="https://marceybot.de/aitts-information/" target="_blank">Wichtige Information<i className='importantInformationI bx bx-link-external'></i></a>
          <p className="description">Einrichtung:</p>
          <p className="lowDescription">1. Erstelle eine neue Kanalbelohnung mit einem aktivierten Text-Feld.</p>
          <p className="lowDescription">2. Löse diese Belohnung mit dem Broadcaster-Account einmal ein und schreibe in das Text-Feld "!aitts-connect".</p>
          <p className="lowDescription">3. Deaktiviere bei Bedarf die AI TTS über Commands</p>
          <div className="break"></div>
          <button className="copyLink" onClick={copyLink}>Overlay-Link kopieren</button>
          <button onClick={toggleTTSChannelPoints} className="enableButton channelpointsEnabled">Aktivieren</button>
        </div>

        <div className="donations">
          <a className="importantInformation" href="https://marceybot.de/aitts-information/" target="_blank">Wichtige Information<i className='importantInformationI bx bx-link-external'></i></a>
          <p className="description">Coming soon...</p>
          <button className="copyLink" onClick={copyLink}>Overlay-Link kopieren</button>
        </div>

    </div>
  )
}

export default Content