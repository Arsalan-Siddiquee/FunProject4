import { createContext, useEffect, useState } from "react";
import run from "../../gemini"; 

const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPromt, setRecentPromt] = useState("");
    const [prevPromt, setPrevPromt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData("");
    };

    const onSent = async (prompt) => {
        setResultData("");  
        setLoading(true);
        setShowResult(true);
        let response;

        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPromt(prompt);
        } else {
            setPrevPromt(prev => [...prev, input]);
            setRecentPromt(input);
            response = await run(input);
        }

        try {

            const responseArray = response.split("**");
            let newResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 === 0) {
                    newResponse += responseArray[i];
                } else {
                    newResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let formattedResponse = newResponse.split("*").join("<br>");
            console.log(response);

            let newResponseArray = formattedResponse.split(" ");
            newResponseArray.forEach((word, i) => delayPara(i, word + " "));
            
        } catch (error) {
            console.error("Error in onSent:", error);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    useEffect(() => {}, []); 

    const contextValue = { 
        prevPromt,
        setPrevPromt,
        onSent,
        setRecentPromt,
        recentPromt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
export { Context };
