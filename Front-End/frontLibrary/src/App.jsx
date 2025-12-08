import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Cadastro from './pages/cadastro'
import Catalogo from './pages/catalogo'
import ListaDesejo from './pages/listaDesejo'
import MeusLivros from './pages/meusLivros'
import Perfil from './pages/perfil'
import Dashboard from './pages/dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/lista-desejo" element={<ListaDesejo />} />
          <Route path="/meus-livros" element={<MeusLivros />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
