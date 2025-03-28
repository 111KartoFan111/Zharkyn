import React from 'react'
import Header from './Header/Header'
import Filter from './FilterBlock/Filter'
import CarType from './CarType/CarType'
import CarBrand from './CarBrand/CarBrand'
import FeaturedMain from './FeaturedListings/FeaturedMain'

const Main = () => {
  return (
    <div className='main'>
      <Header />
      <Filter />
      <CarType />
      <CarBrand />
      <FeaturedMain />
    </div>
  )
}

export default Main