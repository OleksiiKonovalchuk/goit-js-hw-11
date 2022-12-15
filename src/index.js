import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchSearch } from './fetch';
let page = 1;
let gallery = new SimpleLightbox('.gallery a', {
  scrollZoom: false,
});
const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector(`[type="text"]`),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
const options = { rootMargin: '0px' };
const callLater = entries => {
  entries.forEach(entry => {
    const value = refs.input.value;
    if (entry.isIntersecting && value !== '') {
      fetchSearch(value, page++)
        .then(({ hits }) => {
          if (hits.length < 40) {
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
            hits.map(cardCreator);
            return gallery.refresh();
          } else {
            hits.map(cardCreator);
            return gallery.refresh();
          }
        })
        .catch(error => console.log(error));
    }
  });
};
let observer = new IntersectionObserver(callLater, options);

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
const onGalleryClick = e => {
  e.preventDefault();
};
const onSubmit = e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  page = 1;
  const value = refs.input.value;
  if (value === '') {
    return Notiflix.Notify.failure(
      'Sorry, You need to typein a word to the search window!'
    );
  }
  fetchSearch(value, page)
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      hits.length < 40
        ? observer.disconnect(document.querySelector('.watch-me'))
        : observer.observe(document.querySelector('.watch-me'));
      gallery.refresh();
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      return hits;
    })
    .then(data => {
      data.map(cardCreator);
      const { height: cardHeight } =
        refs.gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      return gallery.refresh();
    })
    .catch(error => console.log(error));
};

refs.form.addEventListener('submit', onSubmit);
refs.gallery.addEventListener('click', onGalleryClick);
