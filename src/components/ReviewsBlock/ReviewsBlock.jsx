import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './ReviewsBlock.css'



const ReviewsBlock = () => {
  return (
    <div className='ReviewsBlock'>
        <div className='ReviewsTitle'>
            <h2>Что говорят наши клиенты?</h2>
        </div>
        <div className='Reviews'>
        <Swiper modules={[Navigation]} navigation={true} className="mySwiper">
            <SwiperSlide>
                <div className='ReviewsItem'>
                    <div className='ReviewsItemImg'>
                    </div>
                    <div className='ReviewsItemText'>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis.
                        </p>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
        </div>
    </div>
  )
}

export default ReviewsBlock
