import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <nav style={{
      backgroundColor: '#2d6a4f',
      padding: '12px 24px',
      display: 'flex',
      gap: '20px',
      alignItems: 'center'
    }}>
      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
        🍽️ Zero Hunger
      </span>
      <Link to="/food" style={{ color: 'white' }}>Food Listings</Link>
      {role === 'restaurant' && (
        <Link to="/add-food" style={{ color: 'white' }}>Add Food</Link>
      )}
      {role === 'ngo' && (
        <Link to="/nearby" style={{ color: 'white' }}>Nearby Food</Link>
      )}
      <Link to="/requests" style={{ color: 'white' }}>Requests</Link>
      {token && (
        <button onClick={logout} style={{
          marginLeft: 'auto',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          padding: '6px 14px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      )}
    </nav>
  )
}

export default Navbar