import { useState } from "react";
import LinkBox from "./LinkBox";
import { Link } from "react-router-dom";
import logo from "../assets/Ethan's Calcs Logo.png";


export default function Navbar() {
    const[matrixIsOpen, setMatrixIsOpen] = useState(false);

    const toggleMatrixDropdownOpen = () => setMatrixIsOpen(!matrixIsOpen);

    return (
        <nav className="flex items-center py-3 px-2 gap-x-2 shadow-sm">
            <div className='hover:cursor-pointer active:cursor-progress pl-2 pr-3 py-1'>
                <Link title='Home' to={'/'}>
                    <img src={logo} alt={"Ethan's\n Calcs"} width={93} height={45}/>
                </Link>
            </div>
            {/* <LinkBox
                description="A normal calculator" link={'/calculator'}
                name='Calculator' rounded={true}
                />
            | */}
            {/* Matrix Dropdown */}
            <div className="relative">
                <div className={`flex items-center overflow-hidden ${matrixIsOpen ? 'rounded-t-sm inset-shadow-md' : 'rounded-sm'}`}>
                    <LinkBox
                        description={"Matrix Calculators"} link={'/matrix-calculator'}
                        name="Matrix Calculators"
                        className="border-r-2 border-gray-100 p-1"
                    />
                    <div className={`py-1 px-1 hover:bg-gray-200 active:bg-gray-300 hover:inset-shadow-md hover:cursor-pointer ${matrixIsOpen && 'bg-gray-200 inset-shadow-md'}`} onClick={toggleMatrixDropdownOpen}>▼</div>
                </div>
                {matrixIsOpen && (
                    <div className="absolute w-full block bg-white rounded-b-sm border-r border-l border-b border-gray-400">
                        <LinkBox description={"Add or subtract two matrices"} link={'/matrix-calculator/add-sub'} name="Add/Sub"/>
                        <LinkBox description={"Multiply two matrices"} link={'/matrix-calculator/multiplication'} name="Multiplication" />
                        <LinkBox description={"Perform Gaussian or Gauss-Jordan Elimination on a matrix"} link={'/matrix-calculator/elimination'} name="Elimination" />
                        <LinkBox description={"Invert a matrix"} link={'/matrix-calculator/inverse'} name="Inverse" />
                        <LinkBox description={"Do QR Factorization"} link={'/matrix-calculator/qr_factorization'} name="QR Factorization" />
                    </div>
                )}
            </div>
        </nav>
    )
}