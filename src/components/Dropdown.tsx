import { useEffect, useState, type ReactNode } from "react";
import LinkBox from "./LinkBox";

type DropDownProps = {
    name: string,
    to: string,
    children: ReactNode
}
export default function Dropdown({name, to, children}: DropDownProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(()=> {
        const closeDropdown = ()=>{if(isOpen) {setIsOpen(false)};};

        document.addEventListener('click', closeDropdown);

        return ()=>{document.removeEventListener('click', closeDropdown)};
    }, [isOpen]);

    const toggleDropdown = (event: React.MouseEvent)=>{
        event.stopPropagation();
        setIsOpen(!isOpen);
    }

    return (
        <div className="relative">
            <div className={`flex items-center overflow-hidden ${isOpen ? 'rounded-t-sm inset-shadow-md' : 'rounded-sm'}`}>
                <LinkBox
                    description={name} link={to}
                    name={name}
                    className="border-r-2 border-gray-100 p-1"
                />
                <div className={`py-1 px-1 hover:bg-gray-200 active:bg-gray-300 hover:inset-shadow-md hover:cursor-pointer ${isOpen && 'bg-gray-200 inset-shadow-md'}`} onClick={toggleDropdown}>▼</div>
            </div>
            {isOpen && (
                <div className="absolute w-full block bg-white rounded-b-sm border-r border-l border-b border-gray-400">
                    {children}
                </div>
            )}

        </div>
    )
}