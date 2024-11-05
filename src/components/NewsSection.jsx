import React, { useState, useEffect } from 'react';
import { fetchNews } from '../services/api';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const response = await fetchNews();
        
        if (!response.success) {
          throw new Error(response.error);
        }

        setNews(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return <div className="p-4">Loading news...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Latest News</h2>
      <div className="space-y-4">
        {news.map(article => (
          <div key={article.id} className="border p-4 rounded">
            <h3 className="font-medium">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {article.title}
              </a>
            </h3>
            <p className="text-sm text-gray-600 mt-2">{article.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              <span>{article.source}</span>
              <span className="mx-2">•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;