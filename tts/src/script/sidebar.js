document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function(){
        let btn = document.querySelector("#btn");
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
    let isActive = sidebar.classList.contains("active");
    let logoImg = document.querySelector("#logoImage");
    if(isActive){
        logoImg.removeAttribute("hidden");
    } else {
        logoImg.setAttribute("hidden", "hidden");
    }
    }, 0);
})