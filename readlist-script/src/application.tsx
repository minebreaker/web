import * as React from "react"
import * as Icon from "./icon"

type EntryModel = {
    title: string
    link: string
    translationLink?: string
    tag: Array<string>
    comment?: string
}

export class Application extends React.Component<{}, { search: string, data: Array<EntryModel> | null, error: boolean }> {

    constructor(props: {}) {
        super(props)
        this.state = { search: "", data: null, error: false }
    }

    componentDidMount() {
        fetch("./data.json")
            .then(response => response.json())
            .then(data => this.setState({ data }))
            .catch(() => this.setState({ error: true }))
    }

    render(): React.ReactNode {
        if (this.state.error) {
            return (
                <p>データの取得に失敗しました。</p>
            )
        }

        if (!this.state.data) {
            return <Loader />
        }

        return (
            <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Input value={this.state.search} onChange={search => this.setState({ search })} />
                </div>
                <div>
                    {this.state.data
                         .filter(entry =>
                             !this.state.search
                             || this.state.search.split(/\s/)
                                    .map(e => e.trim())
                                    .filter(e => e)
                                    .some(term => entry.title.toLowerCase().includes(term.toLowerCase())
                                        || (entry.tag && !!entry.tag.find(tag => term === tag))
                                        || (!!entry.comment && entry.comment.toLowerCase().includes(term.toLowerCase()))))
                         .map(e =>
                             <Entry key={e.title}
                                    entry={e}
                                    onTagSelect={tag => this.setState({ search: tag })} />)}
                </div>
            </div>
        )
    }
}

function Input(this: { inputEl?: HTMLElement | null }, props: { value: string, onChange: (value: string) => void }) {
    const el = React.useRef<HTMLInputElement>(null)
    return (
        <div className="readlist-search"
             style={{
                 display: "inline-block",
                 borderRadius: "1rem",
                 padding: "0.2rem 1rem",
                 width: "40vw"
             }}
             onClick={() => el.current!.focus()}>
            <Icon.Search className="readlist-icon"
                         style={{ verticalAlign: "middle" }} />
            <input type="text"
                   className="readlist-search"
                   style={{
                       border: "none",
                       outline: "none",
                       width: "calc(100% - 48px)"
                   }}
                   ref={el}
                   value={props.value}
                   onChange={e => props.onChange(e.target.value)} />
            <Icon.Clear className="readlist-icon"
                        style={{ verticalAlign: "middle", cursor: "pointer" }}
                        onClick={() => props.onChange("")} />
        </div>
    )
}

function Entry(props: { entry: EntryModel, onTagSelect: (tag: string) => void }) {
    return (
        <div className="readlist-card"
             style={{
                 margin: "1rem",
                 padding: "1rem 3rem"
             }}>
            <div className="readlist-card-header"
                 style={{
                     display: "flex",
                     justifyContent: "start",
                     alignItems: "flex-end",
                     borderBottom: "solid 2px"
                 }}>
                <h4 style={{ fontSize: "1.4rem", margin: 0 }}>
                    <a style={{ textDecoration: "none" }}
                       href={props.entry.link}>
                        {props.entry.title}
                    </a>
                </h4>
                {props.entry.translationLink && (
                    <div style={{ marginLeft: "1em" }}>
                        <a href={props.entry.translationLink}>
                            <Icon.Translate className="readlist-icon-translate" />
                        </a>
                    </div>
                )}
            </div>
            <div style={{ margin: "1rem" }}>
                {props.entry.tag.map(e => <Tag key={e} tag={e} onClick={tag => props.onTagSelect(tag)} />)}
            </div>
            {props.entry.comment && (
                <div style={{ margin: "1rem" }}>
                    <p style={{ margin: 0 }}
                       dangerouslySetInnerHTML={{ __html: props.entry.comment }} />
                </div>
            )}
        </div>
    )
}

function Tag(props: { tag: string, onClick: (tag: string) => void }) {
    return (
        <span className="readlist-tag"
              style={{
                  margin: "0.2em",
                  borderRadius: "1rem",
                  padding: "0.2rem 1rem",
                  cursor: "pointer"
              }}
              onClick={() => props.onClick(props.tag)}>
            <Icon.LabelOutline className="readlist-tag-icon" style={{ verticalAlign: "sub" }} />
            {props.tag}
        </span>
    )
}

class Loader extends React.Component<{}, { counter: number }> {

    private timer?: number

    constructor(props: {}) {
        super(props);
        this.state = { counter: 0 }
    }

    componentDidMount() {
        this.timer = window.setInterval(() => {
            this.setState(state => ({
                counter: state.counter > 4 ? 0 : state.counter + 1
            }))
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render(): React.ReactNode {
        return (
            <p>ロード中です {".".repeat(this.state.counter)}</p>
        )
    }
}
