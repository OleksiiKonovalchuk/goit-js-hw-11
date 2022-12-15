const axios = require('axios').default;
const PIXABAY = 'https://pixabay.com/api/';
const KEY = '?key=32082136-56f2ee8b0af07ef0cc9c117de';
export const fetchSearch = async (value, page) => {
  const fetch = await axios.get(
    `${PIXABAY}${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  const data = fetch.data;

  return data;
};
