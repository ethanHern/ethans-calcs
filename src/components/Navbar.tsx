import LinkBox from "./LinkBox";
import { Link } from "react-router-dom";
import logo from "../assets/Ethan's Calcs Logo.png";
import Dropdown from "./Dropdown";


export default function Navbar() {

    return (
        <nav className="flex items-center py-3 px-2 gap-x-2 shadow-sm ">
            <div className='hover:cursor-pointer active:cursor-progress pl-2 pr-3 py-1'>
                <Link title='Home' to={'/'}>
                    <img src={logo} alt={"Ethan's\n Calcs"} width={93} height={45} className="min-w-23.25 min-h-11.25"/>
                </Link>
            </div>

            {/* Matrix Dropdown */}
            <Dropdown name={"Matrix Calculators"}>
                <LinkBox description={"Add or subtract two matrices"} link={'/matrix-calculator/add-sub'} name="Add/Sub"/>
                <LinkBox description={"Multiply two matrices"} link={'/matrix-calculator/multiplication'} name="Multiplication" />
                <LinkBox description={"Perform Gaussian or Gauss-Jordan Elimination on a matrix"} link={'/matrix-calculator/elimination'} name="Elimination" />
                <LinkBox description={"Invert a matrix"} link={'/matrix-calculator/inverse'} name="Inverse" />
                <LinkBox description={"Do QR Factorization"} link={'/matrix-calculator/qr_factorization'} name="QR Factorization" />
            </Dropdown>

        </nav>
    )
}