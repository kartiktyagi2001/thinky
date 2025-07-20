import { useState } from "react"
import axios from 'axios'
import { BASE_URL } from "../be_config"


export const Generate = ()=>{

    const [input, setInput] = useState("")
    const [mode, setMode] = useState("FRIEND")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false)

    // let youAsked = ""

    // testlog
    // alert(BASE_URL)


    const sendReq = async()=>{
        if (!input.trim()){
            alert("Prompt cannot be empty!")
            return;
        }

        try{
            setLoading(true)

            const token = localStorage.getItem("token")
            if(!token){
                alert('You must be logged in.')
                return;
            }

            const res = await axios.post(`${BASE_URL}/thinky/generate`, {content: input, mode}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            //test log
            // alert(res)

            setResponse(res.data.response);
            // youAsked= input
            setInput("")

        } catch(err){
            console.error(err);
            alert(err)
            setResponse("Error while generating response.")
        } finally{
            setLoading(false);
        }
    };


    return(

        

        <div className="min-h-screen p-4 bg-zinc-800 flex flex-col items-center">
            <h1 className="text-3xl text-zinc-500 font-extralight mb-4 text-center">Ask Thinky...💭</h1>

            {/* {response && (
                <div className="mt-10 text-zinc-300 max-w-2xl w-full bg-zinc-700 p-4 shadow-2xl rounded-2xl max-h-80 overflow-y-auto">
                    <p className="whitespace-pre-line">{youAsked}</p>
                </div>
            )} */}

            
            {response && (
                <div className="mt-10 text-zinc-300 max-w-2xl w-full bg-zinc-800 p-4 rounded shadow-2xl max-h-80 overflow-y-auto">
                    <h2 className="font-semibold mb-2">Thinky Says:</h2>
                    <p className="whitespace-pre-line">{response}</p>
                </div>
            )}

            <div className="mt-6 max-w-2xl w-full fixed bottom-10">
                <textarea
                    className="text-zinc-400 w-full max-w-2xl mt-10 p-3 rounded-lg bg-zinc-900 placeholder-zinc-600 shadow-2xl resize-none mb-4 focus:outline-none"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex justify-end w-full max-w-2xl">
                    
                    <div className="mr-5">
                        <ModeDropdown mode={mode} setMode={setMode} />
                    </div>

                    <button className="relative shadow-2xl bg-zinc-700  group  py-1.4 px-2.5 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-300 " onClick={sendReq} disabled={loading}>

                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-zinc-300 group-hover:w-full group-hover:transition-all"></span>{loading ? "Thinking..." : "Generate"}
                    </button>

                </div>
            </div>
        </div>
    )

}




function ModeDropdown({
    mode,
    setMode,
}: {
    mode: string;
    setMode: (value: string) => void;
}) {
    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="mode" className="text-sm text-zinc-300">
                Mode:
            </label>
            <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="bg-zinc-700 shadow-2xl text-zinc-300 px-3 py-2 rounded focus:outline-none"
            >
                <option value="FRIEND">Friend</option>
                <option value="DEVLOPER">Developer</option>
                <option value="PHILOSOPHER">Philosopher</option>
            </select>
        </div>
    );
}