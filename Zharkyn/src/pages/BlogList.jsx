import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogService } from '../services/api';

const BlogList = ({ user, onLogout }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const BLOGS_PER_PAGE = 9;

  useEffect(() => {
    // Reset when search changes
    setPage(1);
    setBlogs([]);
    setHasMore(true);
    fetchBlogs(1, true);
  }, [searchTerm]);
  
  useEffect(() => {
    if (page > 1) {
      fetchBlogs(page, false);
    }
  }, [page]);

  const fetchBlogs = async (pageNum, replace = false) => {
    setLoading(true);
    try {
      const skip = (pageNum - 1) * BLOGS_PER_PAGE;
      // Only fetch approved blogs
      const fetchedBlogs = await blogService.getAllBlogs(skip, BLOGS_PER_PAGE);
      
      // Filter by search term if provided
      const filtered = fetchedBlogs.filter(blog => 
        !searchTerm || 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (replace) {
        setBlogs(filtered);
      } else {
        setBlogs(prev => [...prev, ...filtered]);
      }
      
      // If we got fewer blogs than requested, there are no more to load
      setHasMore(filtered.length === BLOGS_PER_PAGE);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setError('Не удалось загрузить блоги. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already triggered by the useEffect watching searchTerm
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <div className="blog-list-container">
        <div className="page-header">
          <h1>Блоги</h1>
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по блогам..."
                className="search-input"
              />
              <button type="submit" className="search-button">Поиск</button>
            </form>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {blogs.length === 0 && !loading ? (
          <div className="no-blogs">
            <h3>Блоги не найдены</h3>
            <p>{searchTerm ? 'Попробуйте изменить параметры поиска' : 'Скоро здесь появятся интересные блоги'}</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map(blog => (
              <div key={blog.id} className="blog-card">
                <Link to={`/blog/${blog.id}`} className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                  <div className="blog-stats overlay">
                    <span className="blog-views">
                      <i className="icon-eye"></i> {blog.views || 0}
                    </span>
                    <span className="blog-likes">
                      <i className="icon-heart"></i> {blog.likes_count || 0}
                    </span>
                    <span className="blog-comments">
                      <i className="icon-comment"></i> {blog.comments?.length || 0}
                    </span>
                  </div>
                </Link>
                <div className="blog-content">
                  <Link to={`/blog/${blog.id}`} className="blog-title-link">
                    <h3 className="blog-title">{blog.title}</h3>
                  </Link>
                  <p className="blog-description">{blog.shortDescription}</p>
                  <div className="blog-meta">
                    <span className="blog-author">{blog.author?.username || 'Автор'}</span>
                    <div className="meta-spacer"></div>
                    <span className="blog-date">{blog.date}</span>
                    <div className="meta-spacer"></div>
                    <span className="blog-reading-time">{blog.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="loading-spinner">Загрузка блогов...</div>
        )}

        {hasMore && !loading && blogs.length > 0 && (
          <div className="load-more">
            <button onClick={handleLoadMore} className="load-more-button">
              Загрузить еще
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BlogList;