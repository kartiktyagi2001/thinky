import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import thinky from '../assets/thinky3.png'


export const Navbar = ()=>{

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

    return (
    <div className="border-b shadow-2xl flex justify-between items-center bg-zinc-800 px-10 py-4">
      <Link to={'/generate'} className="flex items-center justify-center w-20 h-20">
          <img src={thinky} alt="" />
      </Link>

      <div>
        <Link to={'/signin'}>
          <button className="relative rounded-lg inline-block font-medium mr-5 group py-1.5 px-2.5 ">
            <span className="absolute rounded-lg inset-0 w-full h-full transition duration-400 ease-out transform translate-x-1 translate-y-1 bg-zinc-950 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute rounded-lg inset-0 w-full h-full bg-zinc-700 border border-zinc-950 group-hover:bg-zinc-900"></span>
            <span className="relative rounded-lg text-purple-500 ">Switch User</span>
          </button>
        </Link>  
        <ProfilePhoto name={username} />
      </div>
    </div>
  );
}

function ProfilePhoto({name}: {name: string}){
    
    return(
        <div className={`relative inline-flex items-center justify-center h-10 w-10 overflow-hidden bg-zinc-900 rounded-full`}>
            <span className={`text-lg text-purple-500`}>{name[0]}</span>
        </div>
    )

}