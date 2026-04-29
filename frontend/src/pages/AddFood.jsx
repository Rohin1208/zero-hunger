import { useState } from 'react'
import axios from 'axios'

function AddFood() {
  const [foodName, setFoodName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [expiry, setExpiry] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    try {
      await axios.post('http://localhost:5000/food',
        { food_name: foodName, quantity: parseInt(quantity), expiry },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage('✅ Food added successfully!')
      setFoodName('')
      setQuantity('')
      setExpiry('')
    } catch (err) {
      setMessage('❌ Error adding food. Check your inputs.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>➕ Add Food Listing</h2>
      <input
        placeholder="Food name"
        value={foodName}
        onChange={e => setFoodName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
      />
      <input
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
      />
      <input
        type="datetime-local"
        value={expiry}
        onChange={e => setExpiry(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '12px' }}
      />
      {message && <p>{message}</p>}
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#2d6a4f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add Food
      </button>
    </div>
  )
}

export default AddFood