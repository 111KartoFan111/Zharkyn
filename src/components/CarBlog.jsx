import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/CarBlog.css'



const CarBlog = () => {
  return (
    <div id='blog' className='BlogBlock'>
        <div className='BlogTitle'>
            <h2>Что говорят наши клиенты?</h2>
        </div>
        <div className='Blog'>
        <Swiper modules={[Navigation]} navigation={true} className="mySwiper">
            <SwiperSlide>
                <div className='BlogGap'>
                    <div className='BlogItem'>
                        <div className='BlogItemImg'>
                            <img src="public/img/BlogCars/item1.png" alt="" />
                        </div>
                        <div className='BlogItemTitle'>
                            <p>Иван Иванович</p>
                            <div className='rectangle'></div>
                            <p>Иван Иванович</p>
                        </div>
                        <div className='BlogItemText'>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis.
                            </p>
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
        </div>
    </div>
  )
}

export default CarBlog
