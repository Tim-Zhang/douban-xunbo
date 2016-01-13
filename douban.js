var searchUrl = 'http://api.douban.com/v2/movie/search?q='

var searchMovie = function(name) {
	var movieInStore, url;

	movieInStore = getStorage(name);
	if (movieInStore) return Promise.resolve(movieInStore);

	url = searchUrl + encodeURI(name);
	return fetch(url).then(res => res.json()).then(function(data) {
		if (data.count === 0) return Promise.reject();

		return setStorage(name, data.subjects[0]);
	});
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
		var name      = document.querySelector('.pic img').getAttribute('alt')
		  , names     = name.split('/')
		  , firstName = names[0]
		  , result

		searchMovie(firstName).then(function(subject) {
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



