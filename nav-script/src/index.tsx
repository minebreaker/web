import * as React from "react"
import * as ReactDOM from "react-dom"
import { Footer } from "./footer"
import { setUpTheme } from "./theme"


function main() {

    setUpTheme()

    ReactDOM.render(
        <Footer />,
        document.getElementById("footer")
    )
}

document.addEventListener("DOMContentLoaded", () => {
    main()
})
