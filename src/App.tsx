import { BrowserRouter, Route, Routes } from "react-router-dom";
import {lazy, Suspense} from 'react';

const Home = lazy(()=> import("./home"));
const AddSub = lazy(()=> import("./matrix-calculator/add-sub"));
const Navbar = lazy(()=> import("./components/Navbar"));
const Multiplication = lazy(()=> import("./matrix-calculator/multiplication"));
const MatrixHome = lazy(()=> import("./matrix-home"));
const Elimination = lazy(()=>import("./matrix-calculator/elimination"));
const Inverse = lazy(()=> import("./matrix-calculator/inverse"));
const QRFactorization = lazy(()=> import("./matrix-calculator/qr_factorization"));

export default function App() {

  return (
    <>
      <BrowserRouter basename="/ethans-calcs">
        <Navbar/>
        <Suspense fallback={<div>Loading Calculator...</div>}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/matrix-calculator" element={<MatrixHome/>} />
            <Route path="/matrix-calculator/add-sub" element={<AddSub/>}/>
            <Route path="/matrix-calculator/multiplication" element={<Multiplication/>}/>
            <Route path="/matrix-calculator/elimination" element={<Elimination/>}/>
            <Route path="/matrix-calculator/inverse" element={<Inverse/>}/>
            <Route path="/matrix-calculator/qr_factorization" element={<QRFactorization/>}/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}