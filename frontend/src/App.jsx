import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import AdminLandingPage from './pages/Admin/AdminLandingPage'
import AdminLogin from './pages/Auth/AdminLogin'
import AdminSignUp from './pages/Auth/AdminSignUp'
import AdminDashboard from './pages/Admin/AdminDashboard'
import Menu from './pages/Admin/Menu'
import OrderHistory from './pages/Admin/OrderHistory'
import Settings from './pages/Admin/Settings'



function App() {

  return (
    <Router>
    <Routes>
      <Route path='/' element={<AdminLandingPage />} />
      <Route path='/admin-signUp' element={<AdminSignUp />} />
      <Route path='/admin-login' element={<AdminLogin />} />
      <Route path='/admin-dashboard' element={<AdminDashboard />} />
      <Route path='/admin-menu' element={<Menu />} />
      <Route path='/admin-order-history' element={<OrderHistory />} />
      <Route path='/admin-settings' element={<Settings />} />
    </Routes>
  </Router>
  )
}

export default App
