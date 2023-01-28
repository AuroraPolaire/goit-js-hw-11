import { PixabayApi } from './js/PixabayAPI';
import { refs } from './js/refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { gallery } from './js/gallery';

const pixabayApi = new PixabayApi();
let gallerySL = new SimpleLightbox('.gallery a');

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

let callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      Loading.pulse();
      pixabayApi.addPage();
      pixabayApi.getPhoto().then(response => {
        const { hits, total } = response.data;

        const markup = gallery(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        gallerySL.on('show.simplelightbox');
        gallerySL.refresh();

        Loading.remove(1000);

        const ifMore = pixabayApi.hasMorePhotos();
        if (ifMore) {
          const lastImage = document.querySelector('.photo-link:last-child');
          observer.observe(lastImage);
        } else {
          Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
      });
    }
  });
};

let observer = new IntersectionObserver(callback, options);

Loading.init({
  className: 'notiflix-loading',
  backgroundColor: 'rgba(0,0,0,0.3)',
  svgSize: '200px',
  svgColor: 'black',
});

function onSubmitGetValue(e) {
  e.preventDefault();

  let value = e.currentTarget.elements.searchQuery.value.trim();
  pixabayApi.query = value;

  e.currentTarget.reset();
  pixabayApi.resetPage();
  // refs.loadMoreBtn.classList.add('is-hidden');

  ifNoValue(value);

  pixabayApi
    .getPhoto()
    .then(response => {
      const { hits, total } = response.data;

      checkImages(total);
      Loading.pulse();

      const markup = gallery(hits);
      refs.gallery.innerHTML = markup;

      pixabayApi.allImagesSum(total);
      const ifMore = pixabayApi.hasMorePhotos();

      if (ifMore) {
        const lastImage = document.querySelector('.photo-link:last-child');
        observer.observe(lastImage);
      }

      gallerySL.on('show.simplelightbox');
      gallerySL.refresh();

      alerts(total, value);

      Loading.remove(1000);
    })
    .catch(error => {
      Notify.failure(error.message);
    });
}

function ifNoValue(value) {
  if (!value) {
    Notify.failure('Nothing to search');
    // refs.gallery.innerHTML = '';
    // refs.loadMoreBtn.classList.add('is-hidden');

    return;
  }
}
function checkImages(total) {
  if (!total) {
    Notify.failure(
      'Sorry, there are NO images matching your search query. Please try again.'
    );
    refs.gallery.innerHTML = '';
    // refs.loadMoreBtn.classList.add('is-hidden');
    return;
  }
}

function alerts(total, value) {
  if (total > 40) {
    Notify.success(`Hooray! We found ${total} images of "${value}".`);
  }

  pixabayApi.addPage();

  if (total <= 40) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.warning(
      `Sorry, there are only ${total} images matching your search query.`
    );
  }
}
refs.form.addEventListener('submit', onSubmitGetValue);

// async function onClickLoadImages(e) {
//   try {
//     const response = await pixabayApi.getPhoto();
//     const { hits } = response.data;

//     Loading.pulse();
//     pixabayApi.addPage();

//     const markup = gallery(hits);
//     refs.gallery.insertAdjacentHTML('beforeend', markup);

//     // soft scroll code//

//     const { height: cardHeight } = document
//       .querySelector('.photo-card')
//       .firstElementChild.getBoundingClientRect();

//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: 'smooth',
//     });

//     //soft scroll code//

//     gallerySL.refresh();

//     const hasMore = pixabayApi.hasMorePhotos();
//     if (!hasMore) {
//       refs.loadMoreBtn.classList.add('is-hidden');
//       Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//     Loading.remove(1000);
//   } catch (error) {
//     Notify.failure(error.message);
//   }
// }

// refs.loadMoreBtn.addEventListener('click', onClickLoadImages);
