import {Generate} from '../components/generate' 
import {Navbar} from '../components/navbar'

export const Home = ()=>{
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
                <Generate />
            </main>
        </div>
    );
}