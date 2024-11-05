import axios from 'axios';

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const cache = new Map();

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

const getCacheKey = (url, params = {}) => {
  return `${url}${Object.entries(params).sort().join('')}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  return {
    success: false,
    data: [],
    error: errorMessage
  };
};

export const fetchBills = async () => {
  try {
    const cacheKey = getCacheKey('/legislative/bills');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const response = await api.get('/legislative/bills');
    const bills = response.data.bills || [];
    
    const result = {
      success: true,
      data: bills.map(bill => ({
        id: String(bill.bill_id),
        title: String(bill.title || ''),
        status: String(bill.status || ''),
        lastAction: String(bill.last_action || '')
      })),
      error: null
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchOfficialVotes = async (officialId) => {
  try {
    const cacheKey = getCacheKey(`/legislative/votes/${officialId}`);
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const response = await api.get(`/legislative/votes/${officialId}`);
    const votes = response.data.votes || [];

    const result = {
      success: true,
      data: votes.map(vote => ({
        id: String(vote.id),
        billId: String(vote.bill_id),
        vote: String(vote.vote),
        date: String(vote.date)
      })),
      error: null
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchNews = async () => {
  try {
    const cacheKey = getCacheKey('/news');
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const response = await api.get('/news');
    const articles = response.data.articles || [];

    const result = {
      success: true,
      data: articles.map(article => ({
        id: String(Date.now() + Math.random()),
        title: String(article.title || ''),
        description: String(article.description || ''),
        url: String(article.url || ''),
        publishedAt: String(article.publishedAt || ''),
        source: String(article.source?.name || '')
      })),
      error: null
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
};