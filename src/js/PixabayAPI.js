export class PixabayApi {
  #baseUrl = 'https://pixabay.com/api/';
  #api = '33016957-599281d6368203287fa88dc81';
  #query = '';
  #page = 1;
  #allImages = 0;

  getPhoto() {
    const url = `${this.#baseUrl}?key=${this.#api}&q=${
      this.#query
    }&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${
      this.#page
    }`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
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

  get allImages() {
    return this.#allImages;
  }

  get page() {
    return this.#page;
  }
}
