function setUpTheme() {

    const keyTheme = "THEME"
    const themeLight = "LIGHT"
    const themeDark = "DARK"
    let currentTheme = themeLight

    function getCssUrl(theme) {
        return theme === themeLight ? "/index.css" : "/index-dark.css"
    }

    function setTheme(theme) {
        const cssEl = document.createElement("link")
        cssEl.setAttribute("rel", "stylesheet")
        cssEl.setAttribute("href", getCssUrl(theme))
        document.getElementsByTagName("head").item(0).append(cssEl)
    }

    function toggleTheme() {
        const currentTheme = localStorage ? localStorage.getItem(keyTheme) || themeLight : currentTheme
        const newTheme = currentTheme === themeLight ? themeDark : themeLight
        if (localStorage) localStorage.setItem(keyTheme, newTheme)

        setTheme(newTheme)
    }

    document.getElementById("theme").addEventListener("click", toggleTheme)

    if (localStorage && localStorage.getItem(keyTheme) === themeDark) {
        setTheme(themeDark)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setUpTheme()
})
