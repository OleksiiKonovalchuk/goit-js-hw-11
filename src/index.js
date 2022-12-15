import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;
import { fetchSearch } from './fetch';
let page = 1;
let gallery = new SimpleLightbox('.gallery a');
// gallery.on('show.simplelightbox');
const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector(`[type="text"]`),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

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
    'beforeend',
    `<a href="${largeImageURL}" class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
      <ul class="info">
        <li class="info-item">
          <span class="span">Likes</span><p>${likes}</p>
        </li>
        <li class="info-item">
        <span class="span">Views</span><p>${views}</p>
       </li>
        <li class="info-item">
        <span class="span">Comments</span><p>${comments}</p>
        </li>
        <li class="info-item">
        <span class="span">Downloads</span><p>${downloads}</p>
         </li>
      </ul>
    </a>`
  );
};

const showMore = e => {
  e.preventDefault();
  page += 1;
  fetchSearch(refs.input.value, page)
    .then(({ hits }) => {
      if (hits.length < 40) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        hits.map(cardCreator);
        refs.loadMore.classList.remove('shown');
        return gallery.refresh();
      } else {
        hits.map(cardCreator);
        return gallery.refresh();
      }
    })
    .catch(error => console.log(error));
};
const onGalleryClick = e => {
  e.preventDefault();
};
const onSubmit = e => {
  e.preventDefault();

  refs.loadMore.classList.remove('shown');
  refs.gallery.innerHTML = '';
  page = 1;
  const value = refs.input.value;
  if (value === '') {
    return Notiflix.Notify.failure(
      'Sorry, You need to typein a word to search window!'
    );
  }
  fetchSearch(value, page)
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        refs.loadMore.classList.remove('shown');
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      hits.length < 40
        ? refs.loadMore.classList.remove('shown')
        : refs.loadMore.classList.add('shown');
      gallery.refresh();
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      return hits;
    })
    .then(data => {
      data.map(cardCreator);
      return gallery.refresh();
    })
    .catch(error => console.log(error));

  refs.loadMore.addEventListener('click', showMore);
};

refs.form.addEventListener('submit', onSubmit);
refs.gallery.addEventListener('click', onGalleryClick);

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
