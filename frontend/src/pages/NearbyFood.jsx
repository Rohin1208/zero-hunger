import { useEffect, useState } from 'react'
import axios from 'axios'

function NearbyFood() {
  const [foods, setFoods] = useState([])
  const [radius, setRadius] = useState(5)

  const fetchNearby = async () => {
    const userId = localStorage.getItem('userId')
    try {
      const res = await axios.get(
        `http://localhost:5000/food/nearby/${userId}?radius=${radius}`
      )
      setFoods(res.data)
    } catch (err) {
      console.error(err)
    }
  }

useEffect(() => {
  fetchNearby()
// eslint-disable-next-line
}, [])

  return (
    <div>
      <h2>📍 Food Near You</h2>
      <div style={{ marginBottom: '16px' }}>
        <label>Radius (km): </label>
        <input
          type="number"
          value={radius}
          onChange={e => setRadius(e.target.value)}
          style={{ width: '80px', padding: '6px', marginRight: '10px' }}
        />
        <button
          onClick={fetchNearby}
          style={{
            backgroundColor: '#2d6a4f',
            color: 'white',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>
      {foods.length === 0 && <p>No food found nearby.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {foods.map(food => (
          <div key={food.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{food.food_name}</h3>
            <p>Restaurant: {food.restaurant}</p>
            <p>Quantity: {food.quantity}</p>
            <p>Distance: {food.distance_km} km</p>
            <p>Expires: {new Date(food.expiry).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NearbyFood