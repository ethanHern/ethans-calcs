import { Helmet } from "react-helmet-async";
import Logo from './assets/Logo.svg?react';

export default function Home() {
    return (
        <div>
            <Helmet>
                <title>Ethan's Calcs</title>
            </Helmet>
            <div className="lg:px-14 bg-taupe-100 flex h-dvh">
                <div className="flex-col bg-white flex-1 justify-items-center">
                    <Logo className="min-w-52.25 max-w-208.75 min-h-25 max-h-100 py-15 px-8"/>
                    <div className="place-self-start px-12">
                        <p>
                            <span className="font-bold text-7xl">Calc</span> <span className="pl-2 font-light text-4xl font">Verb</span>
                        </p>
                        <p className="pl-3 text-3xl">Ca&bull;lc ˈkælk</p>
                        <p className="pl-3 text-3xl">It's slang for calculator.</p>
                    </div>
                </div>
            </div>
        </div>)
}