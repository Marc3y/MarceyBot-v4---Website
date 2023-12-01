import React from 'react'

export const categories = [
    {
        main: "Dashboard",
        link: "https://marceybot.de/dashboard/",
        icon: "bx bxs-dashboard",
        locked: false,
        selected: false
    },
    {
        main: "Commands",
        link: "https://marceybot.de/commands/",
        icon: "bx bxs-comment-error",
        locked: false,
        selected: true
    },
    {
        main: "Spotify",
        link: "https://marceybot.de/spotify/",
        icon: "bx bxl-spotify",
        locked: false,
        selected: false
    },
    {
        main: "AI TTS",
        link: "https://marceybot.de/aitts/",
        icon: "bx bx-speaker",
        locked: true,
        selected: false
    },
    {
        main: "TTS",
        link: "https://marceybot.de/tts/",
        icon: "bx bxs-speaker",
        locked: true,
        selected: false
    },
    {
        main: "YouTube",
        link: "#",
        icon: "bx bxl-youtube",
        locked: false,
        selected: false
    },
    {
        main: "Chat-Account",
        link: "#",
        icon: "bx bxs-user-account",
        locked: true,
        selected: false
    },
    {
        main: "Video-Requests",
        link: "#",
        icon: "bx bx-video",
        locked: false,
        selected: false
    },
    {
        main: "MarceyBot-API",
        link: "#",
        icon: "bx bxs-detail",
        locked: false,
        selected: false
    },
    {
        main: "Premium",
        link: "#",
        icon: "bx bx-wallet",
        locked: true,
        selected: false
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
        <ul className="nav_list">
            {categories.map((category, index) => (
                <li key={index} className={(category.selected ? 'nav_selected' : 'nav_notselected') + ' ' + category.main}>
                    <a href={category.link} className={"button" + category.main}>
                        <i className={category.icon}></i>
                        <span className={"links_name"}>{category.main}</span>
                    </a>
                    <span className="tooltip">{category.main}</span>
                </li>
            ))}
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