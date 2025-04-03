import React from 'react'
import Header from './Header'
import Filter from './Filter'
import CarType from './CarType'
import CarBrand from './CarBrand'
import FeaturedMain from './FeaturedMain'
import RecentlyAdded from './RecentlyAdded'
import '../styles/Main.css'
import ReviewsBlock from './ReviewsBlock'
import CarBlog from './CarBlog'
import AutoLoanCalculator from './AutoLoanCalculator'
import Footer from './Footer.jsx'
import CarModel from './CarModel'

const Main = () => {
  return (
    <div className='main'>
      <Header />
      <Filter />
      <CarType />
      <CarBrand />
      <FeaturedMain />
      <RecentlyAdded/>
      <ReviewsBlock/>
      <CarBlog/>
      <AutoLoanCalculator />
      <Footer/>
    </div>
  )
}

export default Main