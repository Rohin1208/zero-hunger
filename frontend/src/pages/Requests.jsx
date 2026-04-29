import { useEffect, useState } from 'react'
import axios from 'axios'

function Requests() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/requests/pending')
      .then(res => setRequests(res.data))
      .catch(err => console.error(err))
  }, [])

  const acceptRequest = async (id) => {
    const token = localStorage.getItem('token')
    try {
      await axios.put(`http://localhost:5000/request/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setRequests(requests.filter(r => r.id !== id))
    } catch (err) {
      alert('Error accepting request')
    }
  }

  return (
    <div>
      <h2>📋 Pending Requests</h2>
      {requests.length === 0 && <p>No pending requests.</p>}
      {requests.map(req => (
        <div key={req.id} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          backgroundColor: '#f9f9f9'
        }}>
          <p>Request ID: {req.id}</p>
          <p>Food ID: {req.food_id}</p>
          <p>NGO ID: {req.ngo_id}</p>
          <p>Status: {req.status}</p>
          {localStorage.getItem('role') === 'restaurant' && (
            <button
              onClick={() => acceptRequest(req.id)}
              style={{
                backgroundColor: '#2d6a4f',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Accept
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default Requests