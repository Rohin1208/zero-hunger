import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('restaurant')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { name, role })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', role)
      localStorage.setItem('userId', res.data.userId)
      navigate('/food')
    } catch (err) {
      setError('Invalid credentials. Try again.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
      <h2>🌱 Zero Hunger Login</h2>
      <input
        placeholder="Your name (e.g. Pizza Palace)"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
      />
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
      >
        <option value="restaurant">Restaurant</option>
        <option value="ngo">NGO</option>
      </select>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#2d6a4f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Login
      </button>
    </div>
  )
}

export default Login