import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { newsApi } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await newsApi.getGovernmentNews();
        setNews(data.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Latest Government News</h2>
      <div className="space-y-6">
        {news.map((article) => (
          <article 
            key={article.url} 
            className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
          >
            <h3 className="text-xl font-semibold mb-2">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {article.title}
              </a>
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <span>{article.source.name}</span>
              <span className="mx-2">•</span>
              <time dateTime={article.publishedAt}>
                {format(new Date(article.publishedAt), 'MMM dd, yyyy')}
              </time>
            </div>
            {article.image && (
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
                loading="lazy"
              />
            )}
            <p className="text-gray-600 leading-relaxed">
              {article.description}
            </p>
          </article>
        ))}
        {news.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No news articles available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;