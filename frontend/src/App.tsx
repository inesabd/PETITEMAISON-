import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Products from './pages/products'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  )
}
