import React from 'react'

export const filterOptions = [
    {
        name: "Kein Filter",
        default: false
    },
    {
        name: "Standard-Commands",
        default: false
    },
    {
        name: "Eigene Commands",
        default: false
    }
];

export const sortOption = [
    {
        name: "Keine Sortierung",
        default: false
    },
    {
        name: "A-Z",
        default: false
    }
];


const CommandView = () => {
    const searchBarChange = () => {

    }
    const searchBarClick = () => {
        run();
        function run() {
            const search = document.querySelector(".searchInput");
            if(search.value === "Suchen...") {
                search.value = "";
            }
        }
    }
    const searchBarLost = () => {
        run();
        function run() {
            const search = document.querySelector(".searchInput");
            if(search.value === "") {
                search.value = "Suchen...";
            }
        }
    }
  return (
    <div>

        <p className="title">Commands</p>

        <div className="commandView">
            <div className="filter">
                <div className="select-btn">
                    <span className="sBtn-text">Kein Filter</span>
                    <i className="bx bx-chevron-down"></i>
                </div>
                <ul className="options">
                    {filterOptions.map((filter, index) => (
                        <li className="option" key={index}>
                            <span className="option-text">{filter.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="searchBar">
                <i className='bx bx-search-alt-2'></i>
                <input className="searchInput" type="text" defaultValue="Suchen..." onBlur={searchBarLost} onClick={searchBarClick} onChange={searchBarChange}></input>
            </div>
            <div className="sort">
                <div className="select-btn">
                    <span className="sBtn-text">Keine Sortierung</span>
                    <i className="bx bx-chevron-down"></i>
                </div>
                <ul className="sortOptions">
                    {sortOption.map((sort, index) => (
                        <li className="sortOption" key={index}>
                            <span className="sortOption-text">{sort.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    </div>
  )
}

export default CommandView