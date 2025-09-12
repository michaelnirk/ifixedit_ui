import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount } from '@/store/features/counterSlice'

const Counter = () => {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      textAlign: 'center',
      backgroundColor: 'white'
    }}>
      <h2>Redux Counter Example</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Count: {count}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={() => dispatch(increment())}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        <button 
          onClick={() => dispatch(decrement())}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          -
        </button>
        <button 
          onClick={() => dispatch(incrementByAmount(5))}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +5
        </button>
      </div>
    </div>
  )
}

export default Counter
