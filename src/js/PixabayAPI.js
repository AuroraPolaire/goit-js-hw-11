import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class PixabayApi {
  #baseUrl = 'https://pixabay.com/api/';
  #apiId = '33016957-599281d6368203287fa88dc81';
  #query = '';
  #page = 1;
  #allImages = 0;

  async getPhoto() {
    const searchParams = {
      params: {
        key: this.#apiId,
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: this.#page,
      },
    };

    const response = await axios.get(`${this.#baseUrl}`, searchParams);
    return response;
  }

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  addPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  allImagesSum(total) {
    this.#allImages = total;
  }

  hasMorePhotos() {
    return this.#page <= Math.ceil(this.#allImages / 40);
  }
}
