import React, { useState, useEffect } from 'react'
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
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (selectedBrand && selectedType) {
      openKolesaLink();
      setSelectedBrand('');
      setSelectedType('');
    }
  }, [selectedBrand, selectedType]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const openKolesaLink = () => {
    if (selectedBrand && selectedType) {
      const url = `https://kolesa.kz/cars/${selectedBrand}/${selectedType}/`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className='main'>
      <Header />
      <Filter />
      <CarType onTypeSelect={handleTypeSelect} selectedType={selectedType} />
      <CarBrand onBrandSelect={handleBrandSelect} selectedBrand={selectedBrand} />
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