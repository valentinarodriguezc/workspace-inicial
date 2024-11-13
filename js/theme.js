document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("themeSwitch");
    const body = document.body;

    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            themeSwitch.checked = true;
        } else {
            body.classList.remove("dark-mode");
            themeSwitch.checked = false;
        }
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    themeSwitch.addEventListener("change", () => {
        const theme = themeSwitch.checked ? "dark" : "light";
        applyTheme(theme);
        localStorage.setItem("theme", theme);
    });
});
