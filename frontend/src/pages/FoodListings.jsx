import { useEffect, useState } from 'react'
import axios from 'axios'

function FoodListings() {
  const [foods, setFoods] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/food')
      .then(res => setFoods(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h2>🍕 Available Food Listings</h2>
      {foods.length === 0 && <p>No food available right now.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {foods.map(food => (
          <div key={food.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>{food.food_name}</h3>
            <p>Quantity: {food.quantity}</p>
            <p>Expires: {new Date(food.expiry).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FoodListings