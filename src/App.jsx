import { Routes, Route } from 'react-router-dom'
import LandingC from './components/pages/LandingC'
import Dashboard from './components/pages/Dashboard'
import UpdateInventory from './components/pages/UpdateInventory'
import WaitingGame from './components/pages/WaitingGame'
import AppLayout from './components/AppLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingC />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard"        element={<Dashboard />} />
        <Route path="/update-inventory" element={<UpdateInventory />} />
        <Route path="/waiting-game"     element={<WaitingGame />} />
      </Route>
    </Routes>
  )
}
