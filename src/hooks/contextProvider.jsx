import { createContext, useState } from "react";


export const Context = createContext()

const ContextProvider = ({children}) => {

    const [ name, setName ] = useState("miirshe")

    return <Context.Provider value={{ name, setName }} >

        {children}
    </Context.Provider>
}

export default ContextProvider