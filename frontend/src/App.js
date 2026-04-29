import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import FoodListings from './pages/FoodListings'
import AddFood from './pages/AddFood'
import Requests from './pages/Requests'
import NearbyFood from './pages/NearbyFood'

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/food" element={<FoodListings />} />
          <Route path="/add-food" element={<AddFood />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/nearby" element={<NearbyFood />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App