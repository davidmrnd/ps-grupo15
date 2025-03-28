function toggle() {
    const menuButton = document.querySelector(".menu-button");
    const navLinks = document.querySelector(".nav-links");
    const rightContainer = document.querySelector(".right-container");

    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        rightContainer.classList.toggle("open");
    });
}