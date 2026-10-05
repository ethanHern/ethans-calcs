import { Helmet } from "react-helmet-async";
import Logo from './assets/Logo.svg?react';

export default function Home() {
    return (
        <div>
            <Helmet>
                <title>Ethan's Calcs</title>
            </Helmet>
            <div className="bg-blue-200 flex h-screen px-8">
                <div className="flex-col bg-green-500 h-screen flex-1 self-start items-center">
                    <Logo />
                    
                </div>
            </div>
        </div>)
}