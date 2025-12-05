const global = {
  CurrentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: "4ddc22750c84515acc020b36bae5905a",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` <a href="movie-details.html?id=${movie.id}">
    
    ${
      movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
        : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${movie.title}</h5>
    <p class="card-text">
      <small class="text-muted">Release: ${movie.release_date}</small>
    </p>
  </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

async function displayPopularTvShow() {
  const { results } = await fetchAPIData("tv/popular");
  results.forEach((tvSeries) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` <a href="tv-details.html?id=${tvSeries.id}">
      
      ${
        tvSeries.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${tvSeries.poster_path}" class="card-img-top" alt="${tvSeries.title}" />`
          : `<img src="images/no-image.jpg" class="card-img-top" alt="${tvSeries.title}" />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${tvSeries.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${tvSeries.first_air_date}</small>
      </p>
    </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// Display Movie Details

async function displayMovieDetails() {
  const movieId = document.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background Image
  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = ` <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
      : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
       ${movie.genres.map((gener) => `<li>${gener.name}</li>`).join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span>${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> ${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
     ${movie.production_companies
       .map((proComp) => `<span> ${proComp.name} </span>`)
       .join("")}
  </div>
</div>`;

  document.querySelector("#movie-details").appendChild(div);
}

// Display TV Show Details
async function displayTvShowDetails() {
  const showId = document.location.search.split("=")[1];
  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background Image
  displayBackgroundImage("show", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = ` <div class="details-top">
        <div>
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.title}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.title}" />`
        }
        </div>
        <div>
          <h2>${show.name}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${show.vote_average} / 10
          </p>
          <p class="text-muted">Release Date: ${show.release_date}</p>
          <p>
            ${show.overview}
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
             ${show.genres.map((gener) => `<li>${gener.name}</li>`).join("")}
          </ul>
          <a href="${
            show.homepage
          }" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>
      </div>
      <div class="details-bottom">
        <h2>Movie Info</h2>
        <ul>
          <li><span class="text-secondary">Number of Episodes:</span>${
            show.number_of_episodes
          }</li>
          <li><span class="text-secondary">Last Episode To Air:</span> ${
            show.last_episode_to_air.name
          }</li>
          <li><span class="text-secondary">Status:</span> ${show.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">
           ${show.production_companies
             .map((proComp) => `<span> ${proComp.name} </span>`)
             .join("")}
        </div>
      </div>`;

  document.querySelector("#show-details").appendChild(div);
}

// Display backdrop On details page

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.classList.add("back-drop-image");

  if (type == "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}

// Search Moview and show

async function search() {
  const queryString = window.location.search;
  const urlParam = new URLSearchParams(queryString);
  global.search.type = urlParam.get("type");
  global.search.term = urlParam.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    // @todo - make request and display results
    const { results, total_pages, page } = await searchAPIData();

    if (results.length === 0) {
      showAlert("No result found");
      return;
    }

    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please Insert a Search Term", "error");
  }

  // console.log(urlParam.get("type"));
}

function displaySearchResults(results) {
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = ` <a href="${global.search.type}-details.html?id=${
      result.id
    }">
    
    ${
      result.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${
            result.poster_path
          }" class="card-img-top" alt="${
            global.search.type === "movie" ? result.title : result.name
          }" />`
        : `<img src="images/no-image.jpg" class="card-img-top" alt="${
            global.search.type === "movie" ? result.title : result.name
          }" />`
    }
  </a>
  <div class="card-body">
    <h5 class="card-title">${
      global.search.type === "movie" ? result.title : result.name
    }</h5>
    <p class="card-text">
      <small class="text-muted">Release: ${
        global.search.type === "movie"
          ? result.release_date
          : result.first_air_date
      }</small>
    </p>
  </div>`;
    document.querySelector("#search-results").appendChild(div);
  });
}

async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  console.log(results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average}/10
  </h4>`;

    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Fetch DATA FROM TMDB API
async function fetchAPIData(endPoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endPoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// function highlight Current Routing
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.CurrentPage) {
      link.classList.add("active");
    }
  });
}

// Search Fetch DATA FROM TMDB API
async function searchAPIData() {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`
  );
  const data = await response.json();
  hideSpinner();
  return data;
}

// function highlight Current Routing
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.CurrentPage) {
      link.classList.add("active");
    }
  });
}

// Show Error Alert
function showAlert(message, className) {
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert", className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertElement);

  setTimeout(function () {
    alertElement.remove();
  }, 3000);
}

// function add Commas

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

// Init
function init() {
  switch (global.CurrentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayPopularTvShow();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayTvShowDetails();
      break;
    case "/search.html":
      search();
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
