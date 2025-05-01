import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/CarBlog.css';
import { blogService } from '../services/api';

const CarBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      setLoading(true);
      try {
        const featuredBlogs = await blogService.getFeaturedBlogs(4); // Fetch top 4 blogs by views
        setBlogs(featuredBlogs);
      } catch (err) {
        console.error('Failed to fetch featured blogs:', err);
        setError('Не удалось загрузить блоги');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  return (
    <div id='blog' className='BlogBlock'>
      <div className='BlogTitle'>
        <h2>Блог</h2>
      </div>
      <div className='Blog'>
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="no-blogs-message">Нет доступных блогов</div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            navigation={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              // Mobile small (≤480px)
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              // Mobile large (≤768px)
              481: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              // Tablet and above (>768px)
              769: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className="mySwiper"
          >
            {blogs.map((blog) => (
              <SwiperSlide key={blog.id}>
                <div
                  className='BlogItem'
                  onClick={() => navigate(`/blog/${blog.id}`)}
                >
                  <div className='BlogItemImg'>
                    <img src={blog.image} alt={blog.title} />
                  </div>
                  <div className='BlogItemTitle'>
                    <p>{blog.author.username}</p>
                    <div className='rectangle'></div>
                    <p>{new Date(blog.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className='BlogItemText'>
                    <h3>{blog.title}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default CarBlog;