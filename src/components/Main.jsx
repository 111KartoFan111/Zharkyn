import React from 'react'
import Header from './Header/Header'
import Filter from './FilterBlock/Filter'
import CarType from './CarType/CarType'
import CarBrand from './CarBrand/CarBrand'
import FeaturedMain from './FeaturedListings/FeaturedMain'
import RecentlyAdded from './RecentlyAdded/RecentlyAdded'
import './Main.css'
import ReviewsBlock from './ReviewsBlock/ReviewsBlock'

const Main = () => {
  return (
    <div className='main'>
      <Header />
      <Filter />
      <CarType />
      <CarBrand />
      <FeaturedMain />
      <div className='UpperBut'>
        <div className='upFlex'>
          <a href='#' >
            <img className='upImg' src="./img/upIMg.svg" alt="" />
          </a>
        </div>
      </div>
      <RecentlyAdded/>
      <ReviewsBlock/>
    </div>
  )
}

export default Main