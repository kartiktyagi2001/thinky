import { useState, type ChangeEvent } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from "../be_config"

export const Auth = ({type}: {type: "signup"|"signin"})=>{

    const navigate = useNavigate();


    //test log
    // alert(BASE_URL)
    
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: ""
    })

    async function sendRequest() {
        try{
            const response = await axios.post(`${BASE_URL}/thinky/${type==="signup" ? 'signup' : 'signin'}`, credentials);

            //since BE returns a json err, we check it here or else it will be treated as sucess and err never catched in case of signin
            if (response.data.error) {
                alert(response.data.error);
                return;
            }
            const jwt = response.data.jwt;

            //test log
            console.log(jwt)

            localStorage.setItem("token", jwt); //saved the jwt in browser so that it can be used to verify user auth via token validation
            localStorage.setItem("username", response.data.name);
            
            navigate('/generate');

        } catch(err){
            console.log(err)
            alert("Something went wrong, please try again!")
        }
    }


    return(
        <div className="h-screen bg-zinc-950 flex justify-center flex-col">
            <div className="flex  justify-center">
                <div>
                    <div className='p-4'>
                        <div className="text-4xl text-zinc-300 font-bold">
                            {type==="signup" ? 'Create an account.' : 'Welcome back.'}
                        </div>
                        <div className="text-zinc-600 ">
                            {type=== "signup" ? "Already have an account?" : "Don't have an account?"} <Link to={type === "signup" ? '/signin' : '/signup'} className='underline hover:text-purple-500'>{type === "signup" ? 'Hop in.' : 'Join, its free!'}</Link>
                        </div>
                    </div>

                    <div className='mt-2'>
                        {type === "signup" ? <LabelledInput label="Name" placeholder="Kartik Tyagi" onChange={(e)=>{
                            setCredentials({
                                ...credentials,
                                name: e.target.value,
                                //this basically fetches all the input values of state variable with original value and then overrides one value ata time(name in this case)
                            })
                        }} /> : null}
                        <LabelledInput label="Email" placeholder="Kartik@mail.com" onChange={(e)=>{
                            setCredentials({
                                ...credentials,
                                email: e.target.value,
                            })
                        }} />
                        <LabelledInput label="Password" type= "password" placeholder="123@abc" onChange={(e)=>{
                            setCredentials({
                                ...credentials,
                                password: e.target.value,
                            })
                        }} />

                        <button onClick={sendRequest} type="button" className=" w-full mt-6 text-white bg-black border-b border-purple-400 hover:bg-purple-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ">{type === "signup" ? "Signup" : "Signin"}</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string
}

//lets user pass the values of label and placeholders

function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
  return (
    //got this from flowbite website
    <div>
      <label className="block mb-1 text-sm font-medium text-zinc-50 dark:text-black">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type ||"text"}
        id="first_name"
        className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm rounded-lg focus:outline-none block w-full p-2.5 mb-3"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
