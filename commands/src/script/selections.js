document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        const optionMenu = document.querySelector(".filter"),
        selectBtn = optionMenu.querySelector(".select-btn"),
        options = optionMenu.querySelectorAll(".option"),
        sBtn_text = optionMenu.querySelector(".sBtn-text");

        const sortOptionMenu = document.querySelector(".sort"),
        sortSelectBtn = sortOptionMenu.querySelector(".select-btn"),
        sortOptions = sortOptionMenu.querySelectorAll(".sortOption"),
        sortBtn_text = sortOptionMenu.querySelector(".sBtn-text");

        sortSelectBtn.addEventListener("click", () => {
            sortOptionMenu.classList.toggle("active");
        });

        sortOptions.forEach(option => {
            option.addEventListener("click", () => {
                let selectedOption = option.querySelector(".sortOption-text").innerText;
                sortBtn_text.innerText = selectedOption;
                sortOptionMenu.classList.toggle("active");
            });
        });

        selectBtn.addEventListener("click", () => {
            optionMenu.classList.toggle("active");
        });

        options.forEach(option => {
        option.addEventListener("click", () => {
            let selectedOption = option.querySelector(".option-text").innerText;
            sBtn_text.innerText = selectedOption;

            optionMenu.classList.toggle("active");
        });
        })
    }, 100);
});