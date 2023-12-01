import React from 'react'

export const categories = [
    {
        main: "Dashboard",
        link: "https://marceybot.de/dashboard/",
        icon: "bx bxs-dashboard",
        locked: false,
        selected: true,
        category: "MAIN"
    },
    {
        main: "Statistiken",
        link: "https://marceybot.de/statistiken/",
        icon: "bx bxs-dashboard",
        locked: false,
        selected: false,
        category: "MAIN"
    },
    {
        main: "Profil",
        link: "https://marceybot.de/profile/",
        icon: "bx bxs-dashboard",
        locked: false,
        selected: false,
        category: "MAIN"
    },
    {
        main: "Commands",
        link: "https://marceybot.de/commands/",
        icon: "bx bxs-comment-error",
        locked: false,
        selected: false,
        category: "MAIN"
    },
    {
        main: "Spotify",
        link: "https://marceybot.de/spotify/",
        icon: "bx bxl-spotify",
        locked: false,
        selected: false,
        category: "ENTERTAINMENT"
    },
    {
        main: "AI TTS",
        link: "https://marceybot.de/aitts/",
        icon: "bx bx-speaker",
        locked: true,
        selected: false,
        category: "ENTERTAINMENT"
    },
    {
        main: "TTS",
        link: "https://marceybot.de/tts/",
        icon: "bx bxs-speaker",
        locked: true,
        selected: false,
        category: "ENTERTAINMENT"
    },
    {
        main: "YouTube",
        link: "#",
        icon: "bx bxl-youtube",
        locked: false,
        selected: false,
        category: "ENTERTAINMENT"
    },
    {
        main: "Chat-Account",
        link: "#",
        icon: "bx bxs-user-account",
        locked: true,
        selected: false,
        category: "EXTRAS"
    },
    {
        main: "Video-Requests",
        link: "#",
        icon: "bx bx-video",
        locked: false,
        selected: false,
        category: "ENTERTAINMENT"
    },
    {
        main: "MarceyBot-API",
        link: "#",
        icon: "bx bxs-detail",
        locked: false,
        selected: false,
        category: "EXTRAS"
    },
    {
        main: "Premium",
        link: "#",
        icon: "bx bx-wallet",
        locked: true,
        selected: false,
        category: "PREMIUM"
    }
];

const SideNav = () => {
    const toggleSidebar = () => {
        let btn = document.querySelector("#btn");
        let sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("active");
        let isActive = sidebar.classList.contains("active");
        let logoImg = document.querySelector("#logoImage");
        let profilePicture = document.querySelector("#profilePicture");
    }
 return (
    <div className="sidebar">
        
        <div className="logo_content">
            <div className="logo">
                <img id="logoImage" src="https://i.ibb.co/rvb46SJ/dfgdfg.png" alt="MarceyBot-Logo"></img>
            </div>
            <button onClick={toggleSidebar}>
              <i className='bx bx-menu' id="btn"></i>
            </button>
        </div>
        <ul className="sidebarList">
            <span className="sidebarCategory">MAIN</span>
            <li className="sidebarObject">
                <i className="bx bxs-dashboard"></i>
                <p className="sidebarObjectName">Beispiel 1</p>
            </li>
            <li className="sidebarObject">
                <i className="bx bxs-dashboard"></i>
                <p className="sidebarObjectName">Beispiel 2</p>
            </li>
        </ul>
        <ul className="sidebarList">
            <span className="sidebarCategory">EXTRAS</span>
            <li className="sidebarObject">
                <i className="bx bxs-dashboard"></i>
                <p className="sidebarObjectName">ABClol</p>
            </li>
            <li className="sidebarObject">
                <i className="bx bxs-dashboard"></i>
                <p className="sidebarObjectName">Penislol</p>
            </li>
        </ul>
        <div className="profile_content">
            <div className="profile">
                <div className="profile_details">
                    <img id="profilePicture" src="https://i.ibb.co/rvV6WJN/ezgif-2-7834531d26.gif" alt="Profile Picture"></img>
                    <div className="name_service">
                        <div id="twitchName" className="name">Loading...</div>
                        <div id="service" className="service">Loading...</div>
                    </div>
                </div>
                <a href="">
                  <i className='bx bx-log-out' id="log_out" ></i>
                </a>
            </div>
        </div>
    
    </div>
)};
export default SideNav