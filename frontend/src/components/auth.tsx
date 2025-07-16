import { useState, type ChangeEvent } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

export const Auth = ({type}: {type: "signup"|"signin"})=>{

    const navigate = useNavigate();

    const BACKEND_URL = import.meta.env.BASE_URL

    //test log
    alert(BACKEND_URL)
    
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: ""
    })

    async function sendRequest() {
        try{
            const response = await axios.post(`${BACKEND_URL}/user/${type==="signup" ? 'signup' : 'signin'}`, credentials);

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
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className='p-4'>
                        <div className="text-4xl font-bold">
                            {type==="signup" ? 'Create an account.' : 'Welcome back.'}
                        </div>
                        <div className="text-slate-400 ">
                            {type=== "signup" ? "Already have an account?" : "Don't have an account?"} <Link to={type === "signup" ? '/signin' : '/signup'} className='underline'>{type === "signup" ? 'Signin' : 'Join, its free!'}</Link>
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

                        <button onClick={sendRequest} type="button" className=" w-full mt-6 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{type === "signup" ? "Signup" : "Signin"}</button>
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
      <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-black">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type ||"text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                   focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
