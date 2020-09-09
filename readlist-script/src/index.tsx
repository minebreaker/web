import * as React from "react"
import * as ReactDOM from "react-dom"
import { Application } from "./application"

function main() {
    ReactDOM.render(
        <Application />,
        document.getElementById("app")
    )
}

document.addEventListener("DOMContentLoaded", () => {
    main()
})
