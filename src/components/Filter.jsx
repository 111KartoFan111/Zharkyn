import React from 'react'
import Form from './Form'
import '../styles/Block/Filter.css'
import CarModel from './CarModel'

const Filter = () => {
  return (
    <div className='filter'>
        <Form />
        <CarModel />
    </div>
  )
}

export default Filter