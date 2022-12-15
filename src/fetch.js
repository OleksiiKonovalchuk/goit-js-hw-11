const axios = require('axios').default;
const PIXABAY = 'https://pixabay.com/api/';
const KEY = '32082136-56f2ee8b0af07ef0cc9c117de';
export const fetchSearch = async (value, page) => {
  const searchParams = new URLSearchParams({
    key: KEY,
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  const fetch = await axios.get(`${PIXABAY}?${searchParams}`);
  const data = fetch.data;
  return data;
};
