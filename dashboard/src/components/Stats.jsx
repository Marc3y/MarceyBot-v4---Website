import React from 'react'

export const stats = [
    {
        name: "Follower",
        time: "Insgesamt",
        icon: "bx bxs-user",
        id: "totalfollower",
        value: "0"
    },
    {
        name: "Follower",
        time: "letzte 30 Tage",
        icon: "bx bxs-user-plus",
        id: "follower",
        value: "0"
    },
    {
        name: "Avg. Zuschauer",
        time: "letzte 30 Tage",
        icon: "bx bx-video-recording",
        id: "avgviewer",
        value: "0"
    },
    {
        name: "Stream-Time",
        time: "letzte 30 Tage",
        icon: "bx bx-video-recording",
        id: "streamtime",
        value: "0"
    },
    {
        name: "Max. Zuschauer",
        time: "letzte 30 Tage",
        icon: "bx bx-video-recording",
        id: "maxviewer",
        value: "0"
    },
    {
        name: "Rang",
        time: "Insgesamt",
        icon: "bx bx-video-recording",
        id: "rang",
        value: "0"
    }
];

const Stats = () => {
  return (
    <div>

    <ul className="box-container">


      {stats.map((stat, index) => (
        <li className="stat-box bg-primary" key={index}> 
        <div className="stat-icon">
           <i className={stat.icon}></i>
        </div>
          <p className="stat-name">{stat.name}</p>
          <p className="stat-time">{stat.time}</p>
          <p className="stat-value" id={stat.id}>...</p>
        </li>
      ))}

    </ul>

    </div>
  )
}

export default Stats