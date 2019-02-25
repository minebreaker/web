const keyTheme = "THEME"

export enum Theme {
    LIGHT = "LIGHT",
    DARK = "DARK"
}

function getCssUrl(theme: Theme): string {
    return theme === Theme.LIGHT
        ? "/index.css"
        : "/index-dark.css"
}

function setTheme(theme: Theme) {

    if (localStorage) localStorage.setItem(keyTheme, theme)

    const cssEl = document.createElement("link")
    cssEl.setAttribute("rel", "stylesheet")
    cssEl.setAttribute("href", getCssUrl(theme))
    document.getElementsByTagName("head")!.item(0)!.append(cssEl)
}

export function toggleTheme() {
    const currentTheme = localStorage && localStorage.getItem(keyTheme) || Theme.LIGHT
    const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT

    setTheme(newTheme)
}

export function setUpTheme() {
    if (localStorage && localStorage.getItem(keyTheme) === Theme.DARK) {
        setTheme(Theme.DARK)
    }
}
