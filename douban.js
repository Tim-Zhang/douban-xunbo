var searchUrl = 'http://api.douban.com/v2/movie/search?q='

var searchMovie = function(name) {
	var movieInStore, url

	movieInStore = getStorage(name);
	if (movieInStore) return Promise.resolve(movieInStore);

	url = searchUrl + encodeURI(name);
	return Promise.resolve($.get(url)).then(function(data) {
		if (data.count === 0) return Promise.reject();

		return setStorage(name, data.subjects[0]);
	});
}

var isSinglePage = function() {
	return /\/Html\/\w+\.html/.test(location.pathname);
}

var setStorage = function(name, value) {
  name = name;
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
		var name      = $('.pic img').prop('alt')
		  , names     = name.split('/')
		  , firstName = names[0]
		  , result

		searchMovie(firstName).then(function(subject) {
			var rating  = subject.rating.average
			  , poster  = subject.images.large
			  , url     = subject.alt

			result = '<a style="color: #072;" href="' + url + '">豆瓣评分 ' + rating + '</a>'
			render(result);
		}).catch(function() {
			render('豆瓣没找到结果');
		});
}

var render = function(content) {
	var style = 'font-size: 16px; margin-left: 5px; padding-left: 9px; border-left: 1px solid #8E8E8E';
	content = $('<span style="' + style + '">').html(content);
	$('div.starscore').width('auto').eq(0).append(content);
}

switch(true) {
	case /\/Html\/\w+\.html/.test(location.pathname):
		processSinglePage();
		break;
}



