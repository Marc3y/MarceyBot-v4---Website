document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        let inputFieldDefault = document.querySelector(".inputFieldDefault");
        let inputField = document.querySelector(".inputField");
        inputFieldDefault.addEventListener("click", () => {
            inputField.focus();
        });
    }, 10);
});