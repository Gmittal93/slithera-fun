// Function to navigate to a new HTML page
function navigateTo(page) {
    window.location.href = page;
}

// Apply random animation delay to each button
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".game-button");
    buttons.forEach(button => {
        const randomDelay = Math.random() * 1; // Random delay between 0s and 1s
        button.style.animationDelay = `${randomDelay}s`;
    });
});
