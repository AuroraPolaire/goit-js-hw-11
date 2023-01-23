import { PixabayApi } from './js/PixabayAPI';
import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { gallery } from './js/gallery';

const pixabayApi = new PixabayApi();
let gallerySL = new SimpleLightbox('.gallery a');

Loading.init({
  className: 'notiflix-loading',
  backgroundColor: 'rgba(0,0,0,0.3)',
  svgSize: '200px',
  svgColor: 'black',
});

function onSubmitGetValue(e) {
  e.preventDefault();

  let value = e.currentTarget.elements.searchQuery.value;
  pixabayApi.query = value.trim();

  e.currentTarget.reset();
  pixabayApi.resetPage();
  refs.loadMoreBtn.classList.add('is-hidden');

  if (!value) {
    Notify.failure('Nothing to search');
    refs.gallery.innerHTML = '';
    refs.loadMoreBtn.classList.add('is-hidden');

    return;
  }

  pixabayApi.getPhoto().then(response => {
    const { hits, total } = response.data;
    if (total === 0) {
      Notify.failure(
        'Sorry, there are NO images matching your search query. Please try again.'
      );
      refs.gallery.innerHTML = '';
      refs.loadMoreBtn.classList.add('is-hidden');
      return;
    }
    Loading.pulse();

    pixabayApi.allImagesSum(total);

    refs.loadMoreBtn.classList.remove('is-hidden');

    const markup = gallery(hits);
    refs.gallery.innerHTML = markup;

    gallerySL.on('show.simplelightbox');
    gallerySL.refresh();

    if (total > 40) {
      Notify.success(`Hooray! We found ${total} images of "${value}".`);
    }

    const hasMore = pixabayApi.hasMorePhotos();
    if (hasMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
    pixabayApi.addPage();

    // const pagesAmount = pixabayApi.allImages / pixabayApi.page;

    // if (pixabayApi.page === pagesAmount) {
    if (total <= 40) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.warning(
        `Sorry, there are only ${total} images matching your search query.`
      );
    }

    Loading.remove(1000);
  });
}

function onClickLoadImages(e) {
  pixabayApi.getPhoto().then(response => {
    const { hits, total } = response.data;
    Loading.pulse();
    pixabayApi.addPage();

    const markup = gallery(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    const { height: cardHeight } = document
      .querySelector('.photo-card')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    gallerySL.refresh();

    const hasMore = pixabayApi.hasMorePhotos();
    if (!hasMore) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    Loading.remove(1000);
  });
}

refs.loadMoreBtn.addEventListener('click', onClickLoadImages);
refs.form.addEventListener('submit', onSubmitGetValue);
