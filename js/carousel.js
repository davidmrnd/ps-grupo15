function initCarousel() {
    const carousels = document.querySelectorAll(".carousel-container");

    carousels.forEach(carousel => {
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(track.children);
        const prevButton = carousel.querySelector(".prev-button");
        const nextButton = carousel.querySelector(".next-button");
        const slideWidth = slides[0].getBoundingClientRect().width;
        let index = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${index * slideWidth}px)`;
        }

        nextButton.addEventListener("click", function() {
            if (index < slides.length - 4) {
                index++;
            } else {
                index = 0;
            }
            updateCarousel();
        });

        prevButton.addEventListener("click", function() {
            if (index > 0) {
                index--;
            } else {
                index = slides.length - 4;
            }
            updateCarousel();
        });

        window.addEventListener("resize", function() {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${index * newSlideWidth}px)`;
        });
    });
}