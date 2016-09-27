var searchUrl = 'https://api.douban.com/v2/movie/search?q='

var searchMovie = function(titles, aka) {
  var title = titles[0], movieInStore, url;

  movieInStore = getStorage(title);
  if (movieInStore) return Promise.resolve(movieInStore);


  url = searchUrl + encodeURI(title);
  return fetch(url).then(res => res.json()).then(function(data) {
    if (!data.subjects || !data.subjects.length) {
      const titlePartials = titles[0].split(/\s+/)
      if (titlePartials.length > 1) {
        titles[0] = titlePartials[0]
        return searchMovie(titles)
      }
      return Promise.reject('douban no results')
    }
    return setStorage(name, scoring(data.subjects));
  });
}

var scoring = function(movies) {
  var titles = getTitles()
    , cast = getCast()
    , genres = getGenres()
    , maxScore = 0
    , chosen = null
    , movieCount = movies.length


  movies.forEach((movie, idx) => {
    movie.score = (movieCount - idx) / (movieCount * 10)

    if (titles.includes(movie.title) || titles.includes(movie.original_title)) {
      movie.score += 11
    }

    movie.casts.forEach(c => {
      if (cast.includes(c.name)) movie.score += 10
    })

    movie.genres.forEach(g => {
      if (genres.includes(g)) movie.score += 5
    })

    if (movie.score > maxScore) {
      maxScore = movie.score
      chosen = movie
    }
  })

  return chosen
}

var getCast = function() {
  return queryText('.info li:nth-child(3) a')
}

var getGenres = function() {
  return queryText('.info li:nth-child(2) a')
}

var getTitles = function() {
  return document.querySelector('.pic img').getAttribute('alt').split('/')
}

var queryText = function(selector) {
  var results = []
  document.querySelectorAll(selector).forEach(a => results.push(a.textContent))
  return results
}

var isSinglePage = function() {
  return /\/Html\/\w+\.html/.test(location.pathname);
}

var setStorage = function(name, value) {
  window.sessionStorage[name] = typeof value === 'object' ? JSON.stringify(value) : value;
  return value;
}

var getStorage = function(name) {
  var data, e, error;
  data = window.sessionStorage[name];
  try {
    data = JSON.parse(data);
  } catch (error) {
    e = error;
  }
  return data || '';
}

var processSinglePage = function() {
    const titles = getTitles()
    let result

    searchMovie(titles).then(function(subject) {
      var rating  = subject.rating.average
        , poster  = subject.images.large
        , url     = subject.alt
        , text    = ''

      if (rating)
        text = '豆瓣评分 ' + rating;
      else
        text = '豆瓣评价人数不足';

      result = '<a style="color: #072;" href="' + url + '">' + text + '</a>';
      render(result);
    }).catch(function() {
      render('豆瓣没找到结果');
    });
}

var render = function(content) {
  var style = 'font-size: 16px; margin-left: 5px; padding-left: 9px; border-left: 1px solid #8E8E8E'
    , doubanScoreEl = document.createElement('span')

  doubanScoreEl.style.cssText = style;
  doubanScoreEl.innerHTML = content;

  xunboScoreEl = document.querySelector('div.starscore');
  xunboScoreEl.style.width = 'auto';
  xunboScoreEl.appendChild(doubanScoreEl);

}

switch(true) {
  case /\/Html\/\w+\.html/.test(location.pathname):
    processSinglePage();
    break;
}



