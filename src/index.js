import './css/styles.css';
import Notiflix from 'notiflix';
const axios = require('axios').default;
const PIXABAY = 'https://pixabay.com/api/';
const KEY = '?key=32082136-56f2ee8b0af07ef0cc9c117de';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector(`[type="text"]`),
  gallery: document.querySelector('.gallery'),
};

console.log(refs);

const cardCreator = data => {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = data;
  return refs.gallery.insertAdjacentHTML(
    'afterbegin',
    `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
    </div>`
  );
};
const onSubmit = e => {
  e.preventDefault();
  axios
    .get(
      `${PIXABAY}${KEY}&q=${refs.input.value}&image_type=photo&orientation=horizontal&safesearch=true`
    )
    .then(resp => {
      if (resp.data.hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      return cardCreator(resp.data.hits[0]);
    })
    .catch(error => console.log(error));
};
refs.form.addEventListener('submit', onSubmit);
