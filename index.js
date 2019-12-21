const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
        <img src="${imgSrc}" />
        ${movie.Title}
        (${movie.Year})
      `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: '1324f79a',
        s: searchTerm
      }
    });

    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  }
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#summary-one'), 'search-one');
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#summary-two'), 'search-two');
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete-two'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(
      movie,
      document.querySelector('#summary-three'),
      'search-three'
    );
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete-two'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(
      movie,
      document.querySelector('#summary-four'),
      'search-four'
    );
  }
});

let movieOne;
let movieTwo;
let movieThree;
let movieFour;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: '1324f79a',
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'search-one') {
    movieOne = response.data;
  } else if (side === 'search-two') {
    movieTwo = response.data;
  } else if (side === 'search-three') {
    movieThree = response.data;
  } else {
    movieFour = response.data;
  }

  if ((movieOne && movieTwo) || (movieThree && movieFour)) {
    runComparison();
  }
};

const runComparison = () => {
  const firstSideStats = document.querySelectorAll(
    '#summary-one .notification'
  );
  const secondSideStats = document.querySelectorAll(
    '#summary-two .notification'
  );
  const thirdSideStats = document.querySelectorAll(
    '#summary-three .notification'
  );
  const fourthSideStats = document.querySelectorAll(
    '#summary-four .notification'
  );

  firstSideStats.forEach((statOne, index) => {
    const statTwo = secondSideStats[index];
    const statThree = thirdSideStats[index];
    const statFour = fourthSideStats[index];

    const valueOne = parseInt(statOne.dataset.value);
    const valueTwo = parseInt(statTwo.dataset.value);
    const valueThree = parseInt(statThree.dataset.value);
    const valueFour = parseInt(statFour.dataset.value);

    let valueList = [
      [valueOne, statOne],
      [valueTwo, statTwo],
      [valueThree, statThree],
      [valueFour, statFour]
    ];

    valueList.sort((a, b) => a[0] - b[0]);

    valueList[0][1].classList.remove('is-primary');
    valueList[0][1].classList.add('is-danger');
    valueList[1][1].classList.remove('is-primary');
    valueList[1][1].classList.add('is-warning');
    valueList[2][1].classList.remove('is-primary');
    valueList[2][1].classList.add('is-info');
  });
};

const movieTemplate = movieDetail => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
  </article>
  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imbdRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
