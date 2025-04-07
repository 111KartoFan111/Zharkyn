import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../styles/Block/CarBlog.css'
import blogData from '../blogData.json';

// Пример реализации модального окна в проекте
const BlogPostModal = ({ blog, onClose }) => {
  if (!blog) return null;

  return (
    <div className="blog-modal-overlay" onClick={onClose}>
      <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="blog-modal-close" onClick={onClose}>×</button>
        <div className="blog-modal-header">
          <img src={blog.image} alt={blog.title} className="blog-modal-image" />
          <div className="blog-modal-header-info">
            <h2>{blog.title}</h2>
            <p>{blog.shortDescription}</p>
            <div className="blog-modal-meta">
              <span>{blog.author}</span>
              <div className="blog-modal-dot"></div>
              <span>{blog.date}</span>
              <div className="blog-modal-dot"></div>
              <span>{blog.readTime}</span>
            </div>
          </div>
        </div>
        <div className="blog-modal-body">
          <p>{blog.fullContent}</p>
        </div>
      </div>
    </div>
  );
};

const CarBlog = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <div id='blog' className='BlogBlock'>
      <div className='BlogTitle'>
        <h2>Блог</h2>
      </div>
      <div className='Blog'>
        <Swiper modules={[Navigation]} navigation={true} className="mySwiper">
          <SwiperSlide>
            <div className='BlogGap'>
              {blogData.blogs.map((blog) => (
                <div key={blog.id} className='BlogItem' onClick={() => setSelectedBlog(blog)}>
                  <div className='BlogItemImg'>
                    <img src={blog.image} alt={blog.title} />
                  </div>
                  <div className='BlogItemTitle'>
                    <p>{blog.author}</p>
                    <div className='rectangle'></div>
                    <p>{blog.date}</p>
                  </div>
                  <div className='BlogItemText'>
                    <h3>{blog.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Blog Post Modal */}
      {selectedBlog && (
        <BlogPostModal 
          blog={selectedBlog} 
          onClose={() => setSelectedBlog(null)} 
        />
      )}
    </div>
  )
}

export default CarBlog