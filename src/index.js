import { PixabayApi } from './js/PixabayAPI';
import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { gallery } from './js/gallery';

const pixabayApi = new PixabayApi();
let gallerySL = new SimpleLightbox('.gallery a');

function onSubmitGetValue(e) {
  e.preventDefault();
  let value = e.currentTarget.elements.searchQuery.value;

  if (!value) {
    Notify.failure('Nothing to search');
    return;
  }

  pixabayApi.query = value.trim();
  e.currentTarget.reset();
  pixabayApi.resetPage();

  refs.loadMoreBtn.classList.add('is-hidden');

  pixabayApi
    .getPhoto()
    .then(({ hits, total }) => {
      pixabayApi.allImagesSum(total);

      refs.loadMoreBtn.classList.remove('is-hidden');

      const markup = gallery(hits);
      refs.gallery.innerHTML = markup;

      gallerySL.on('show.simplelightbox');
      gallerySL.refresh();

      if (total !== 0) {
        Notify.success(`Hooray! We found ${total} images of "${value}".`);
      }

      const hasMore = pixabayApi.hasMorePhotos();
      if (hasMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
      pixabayApi.addPage();

      const pagesAmount = pixabayApi.allImages / pixabayApi.page;

      if (pixabayApi.page === pagesAmount) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.failure(
          'Sorry, there are NO images left matching your search query.'
        );
      }

      if (total === 0) {
        Notify.failure(
          'Sorry, there are NO images matching your search query. Please try again.'
        );
        refs.loadMoreBtn.classList.add('is-hidden');
      }
    })
    .catch(error => {
      Notify.failure(error.message);
    });
}

function onClickLoadImages(e) {
  pixabayApi.getPhoto().then(({ hits, total }) => {
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
  });
}

refs.loadMoreBtn.addEventListener('click', onClickLoadImages);
refs.form.addEventListener('submit', onSubmitGetValue);

// document.addEventListener('scroll', function (event) {
//   if (
//     pixabayApi.hasMorePhotos &&
//     window.scrollY + window.innerHeight >
//       document.documentElement.scrollHeight - 1
//   ) {
//     Notify.failure(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
// });
