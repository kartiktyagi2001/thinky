import { useState } from "react"
import axios from 'axios'
import { BASE_URL } from "../be_config"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {DropdownMenuRadioGroup, DropdownMenuRadioItem} from "@radix-ui/react-dropdown-menu"



export const Generate = ()=>{

    const [input, setInput] = useState("")
    const [mode, setMode] = useState("FRIEND")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false)

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

        } catch(err){
            console.error(err);
            alert(err)
            setResponse("Error while generating response.")
        } finally{
            setLoading(false);
        }
    };


    return(

        

        <div className="min-h-screen p-4 bg-zinc-300 flex flex-col items-center">
            <h1 className="text-3xl text-zinc-600 font-extralight mb-4 text-center">Ask Thinky...💭</h1>

            
            {response && (
                <div className="mt-6 max-w-2xl w-full bg-white p-4 rounded shadow max-h-80 overflow-y-auto">
                    <h2 className="font-semibold mb-2">Thinky Says:</h2>
                    <p className="whitespace-pre-line">{response}</p>
                </div>
            )}

            <div className="mt-6 max-w-2xl w-full fixed bottom-10">
                <textarea
                    className="w-full max-w-2xl mt-10 p-3 rounded shadow bg-purple-50 resize-none mb-4"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex justify-end w-full max-w-2xl">
                    
                    <div className="mr-5">
                        <ModeDropdown mode={mode} setMode={setMode} />
                    </div>

                    <button className="relative border bg-zinc-800 border-zinc-100 group  py-1.4 px-2.5 text-zinc-50 hover:bg-zinc-100 hover:text-zinc-900 " onClick={sendReq} disabled={loading}>

                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-zinc-900 group-hover:w-full group-hover:transition-all"></span>{loading ? "Thinking..." : "Generate"}
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
    mode: string
    setMode: (value: string) => void
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-zinc-800 border-gray-300 text-zinc-100 hover:bg-gray-100">
                    Mode: {mode}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-300 border border-gray-200 rounded shadow-lg">
                <DropdownMenuLabel className="text-gray-700 font-semibold px-2 py-1">Select Mode to chat</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 border-t border-gray-200" />
                <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
                    <DropdownMenuRadioItem value="FRIEND" className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded">
                        Friend
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="DEVLOPER" className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded">
                        Developer
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="PHILOSOPHER" className="px-2 py-2 hover:bg-gray-100 cursor-pointer rounded">
                        Philosopher
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}