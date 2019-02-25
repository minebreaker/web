import * as React from "react"
import * as Icon from "./icon"
import { toggleTheme } from "./theme"


export function Footer() {
    return (
        <div className="nav transparent">
            <a className="icon-link"
               title="Search this site. This is a beta feature and uses LocalStorage API to save your settings. If you hate it please disable JavaScript.">
                <Icon.Search className="icon" width={48} height={48} fillOpacity={0.4} />
            </a>
            <a className="icon-link"
               title="Toggle theme. This is a beta feature and uses LocalStorage API to save your settings. If you hate it please disable JavaScript."
               aria-label="Toggle theme"
               onClick={() => toggleTheme()}>
                <Icon.Palette className="icon" width={48} height={48} fillOpacity={0.4} />
            </a>
            <a href="/" className="icon-link" aria-label="Home">
                <Icon.Home className="icon" width={48} height={48} fillOpacity={0.4} />
            </a>
            <a href="#" className="icon-link" aria-label="Top">
                <Icon.KeyboardArrowUp className="icon" width={48} height={48} fillOpacity={0.4} />
            </a>
        </div>
    )
}