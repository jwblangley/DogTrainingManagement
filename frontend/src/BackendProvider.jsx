import { useRef, createContext } from "react"
import BackendAdapter from "./BackendAdapter"

const BackendContext = createContext({})

const BackendProvider = ({children, url}) => {
    const adapter = useRef(new BackendAdapter(url));

    return (
        <BackendContext.Provider value={adapter}>{children}</BackendContext.Provider>
    )
}

export { BackendContext, BackendProvider }
