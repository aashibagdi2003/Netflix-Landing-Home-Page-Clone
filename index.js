//consts
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZjgyZWNlMzU4NTc2OThiMzBkY2VhYWExNmExMmRiYyIsInN1YiI6IjY0OGI1ZTNmNGIwYzYzMDEzZTY0M2IyMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RfYYW7-RI0Ys8h0lgWq4uR0OmCZ6Qr5MClCmDlAqYHU'
  }
};


const apiPaths = {
  fetchAllCategories: `https://api.themoviedb.org/3/genre/movie/list?language=en`,
  fetchMoviesList: `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`,
  fetchimg: `https://api.themoviedb.org/3/movie/550?append_to_response=images&language=en-US&include_image_language=en,null`,
  fetchTrending: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
  searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyBH6L_sCRYxZHiejGaUaUhH8B90em4YzeQ`
};


function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories, options),
    fetch(apiPaths.fetchMoviesList, options),
    fetch(apiPaths.fetchimg, options)
      .then(response => response.json())
      .then(response => {
        const categories = response.genres;
        if (Array.isArray(categories) && categories.length) {
          categories.forEach(category => {
            fetchAndbuildMovieSection(
              apiPaths.fetchMoviesList,
              category);
          });
        }
        //console.log(categories);
      })
      .catch(err => console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  return fetch(fetchUrl, options)
    .then(response => response.json())
    .then(response => {
      //console.table(response.results);
      const movies = response.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryName.name);
      }
      return movies;
    })
    .catch(err => console.error(err))
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);

  const moviesCont = document.getElementById('movies-cont');

  const moviesListHTML = list.map(item => {
    return `
    <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')">
    <img class="movie-item-img" src="${apiPaths.fetchimg}${item.backdrop_path}" alt="${item.title}" >
    <iframe  width="245px" height="150px" src="" id="yt${item.id}"></iframe>
    </div>
    `;
  }).join('');

  const moviesSectionHTML = `
            <h2 class="movies-section-heading">${categoryName}<span class="explore-nudge">  Explore All ></span></h2>
            <div class="movies-row">${moviesListHTML}</div>
  `
  console.log(moviesSectionHTML);

  const div = document.createElement('div');
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;

  //append html into container 
  moviesCont.append(div);
}

function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
      const randomIndex = parseInt(Math.random() * list.length);
      buildBaanerSection(list[randomIndex]);
    }).catch(err => {
      console.error(err);
    });
}

function buildBaanerSection(movie) {
  const bannerCont = document.getElementById('banner-section');
  bannerCont.style.backgroundImage = `${apiPaths.fetchimg}${movie.backdrop_path}`;

  const div = document.createElement('div');
  div.innerHTML = ` <h2 class="banner-title">${movie.title}</h2>
  <p class="banner-info">Trending in movies | Released ${movie.release - date}</p>
  <p class="banner-overview">${movie.overview}</p>
  <div class="action-button-cont">
      <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Play"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp; Play</button>
      <button class="action-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard" data-name="Info"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg> &nbsp; More Info</button>
  </div>`;

  div.className = "banner-content container";
  bannerCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
  console.log(document.getElementById(iframId),iframId);
  if (!movieName) return;

  fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
      const bestresult = res.items[0];
      const youtubeUrl = `https://www.youtube.com/watch?v=${bestresult.id.videoId}`;
      console.log(youtubeUrl);
      const elements = document.getElementById(iframId);
      elements.src = `https://www.youtube.com/embed/${bestresult.id.videoId}?autoplay=1&controls=0`; 
    })
    .catch(err => console.error(err));
}

window.addEventListener('load', function () {
  init();
  window.addEventListener('scroll', function () {
    //header ui update
    const header = this.document.getElementById('header');
    if (this.window.scrollY > 5) header.classList.add('black-bg')
    else header.classList.remove('black-bg');
  })
}); 