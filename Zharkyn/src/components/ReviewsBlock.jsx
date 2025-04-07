import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/ReviewsBlock.css'

const reviews = [
  {
    name: 'Иван Иванович',
    text: 'Очень доволен качеством услуг! Грузоперевозка прошла быстро и без малейших проблем. Профессиональный подход менеджеров и водителей впечатлил.',
    vehicle: 'CarTypeImg/Truck.svg'
  },
  {
    name: 'Анна Петрова',
    text: 'Отличная компания для международных перевозок. Все четко, организованно и в срок. Рекомендую для бизнеса, который дорожит надежностью.',
    vehicle: 'CarTypeImg/Van.svg'
  },
  {
    name: 'Михаил Смирнов',
    text: 'Спасибо за оперативность и внимательность! Мой груз был доставлен точно в указанное время, без повреждений. Буду обращаться again!',
    vehicle: 'CarTypeImg/Van.svg'
  },
  {
    name: 'Елена Николаева',
    text: 'Профессиональный сервис по доступной цене. Менеджеры всегда на связи, подробно объясняют все нюансы. Очень удобно работать с этой компанией.',
    vehicle: 'CarTypeImg/Van.svg'
  }
];

const ReviewsBlock = () => {
  return (
    <div className='ReviewsBlock'>
        <div className='ReviewsTitle'>
            <h2>Что говорят наши клиенты?</h2>
        </div>
        <div className='Reviews'>
            <Swiper
              modules={[Navigation]}
              navigation={true}
              className="mySwiper"
              spaceBetween={30}
              slidesPerView={1}
            >
              {[...Array(Math.ceil(reviews.length / 3))].map((_, i) => (
                <SwiperSlide key={i}>
                  {reviews.slice(i * 3, (i + 1) * 3).map((review, index) => (
                    <div className='ReviewsGap' key={index}>
                        <div className='ReviewsItem'>
                            <div className='ReviewsItemTitle'>
                                <h3>{review.name}</h3>
                                <img src="/img/chitat.svg" alt="Quote icon" />
                            </div>
                            <div className='ReviewsItemText'>
                                <p>{review.text}</p>
                            </div>
                            <div className='ReviewsItemfooter'>
                                <div className='ReviewsItemImg'>
                                    <img src={`/img/${review.vehicle}`} alt="Vehicle type" />
                                </div>
                                <div className='ReviewsItemFooter'>
                                    <p>{review.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                  ))}
                </SwiperSlide>
              ))}
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewsBlock
