import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/ReviewsBlock.css'



const ReviewsBlock = () => {
  return (
    <div className='ReviewsBlock'>
        <div className='ReviewsTitle'>
            <h2>Что говорят наши клиенты?</h2>
        </div>
        <div className='Reviews'>
            <Swiper modules={[Navigation]} navigation={true} className="mySwiper">
                <SwiperSlide>
                    <div className='ReviewsGap'>
                        <div className='ReviewsItem'>
                            <div className='ReviewsItemTitle'>
                                <h3>Иван Иванович</h3>
                                <img src="public\img\chitat.svg" alt="" />
                            </div>
                            <div className='ReviewsItemText'>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, omnis.
                                </p>
                            </div>
                            <div className='ReviewsItemfooter'>
                                <div className='ReviewsItemImg'>
                                    <img src="public\img\CarTypeImg\Truck.svg" alt="" />
                                </div>
                                <div className='ReviewsItemFooter'>
                                    <p>Иван Иванович</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewsBlock
