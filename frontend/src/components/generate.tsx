import React, { useState } from "react"
import axios from 'axios'
import { BASE_URL } from "../be_config"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, type DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

type Checked = DropdownMenuCheckboxItemProps["checked"]


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
            alert(res)

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

        

        <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4 text-center">💭 Thinky</h1>

            
            {response && (
                <div className="mt-6 max-w-2xl w-full bg-white p-4 rounded shadow max-h-80 overflow-y-auto">
                    <h2 className="font-semibold mb-2">Thinky Says:</h2>
                    <p className="whitespace-pre-line">{response}</p>
                </div>
            )}

            <div className="mt-6 max-w-2xl w-full fixed bottom-10">
                <textarea
                    className="w-full max-w-2xl mt-10 p-3 rounded shadow bg-white resize-none mb-4"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex justify-between w-full max-w-2xl">
                    <ModeDropdown mode={mode} setMode={setMode} />


                    <button
                        onClick={sendReq}
                        disabled={loading}
                        className="bg-blue-600 p-2 text-white rounded shadow hover:bg-blue-700"
                    >
                        {loading ? "Thinking..." : "Generate"}
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
        <Button variant="outline">Mode: {mode}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Mode to chat</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={mode} onValueChange={setMode}>
          <DropdownMenuRadioItem value="FRIEND">Friend</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="DEVLOPER">Developer</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="PHILOSOPHER">Philosopher</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}