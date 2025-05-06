import React, { useState } from 'react'
import Form from './Form'
import '../styles/Block/Filter.css'
import CarModel from './CarModel'

const Filter = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className='filter'>
      <div className="filter-container">
        <Form showMore={showMore} />
        <div className="show-more-container">
          <button 
            className="show-more-button"
            onClick={toggleShowMore}
          >
            {showMore ? 'Свернуть фильтры' : 'Показать больше'}
          </button>
        </div>
      </div>
      <CarModel />
    </div>
  )
}

export default Filter