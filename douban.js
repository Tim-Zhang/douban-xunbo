var searchUrl = 'http://api.douban.com/v2/movie/search?q='

var searchMovie = function(name) {
	var url = searchUrl + encodeURI(name);
	return Promise.resolve($.get(url));
}

var isSinglePage = function() {
	return /\/Html\/\w+\.html/.test(location.pathname);
}

var process50ResultPage = function() {
	$('div.hotbox.hotlist ul li a').each(function() {
		var name = $(this).text()
		  , names = name.split('/')
		  , firstName = names[0]

		searchMovie(firstName).then(function(data) {
			console.log(data);
		});

	})
}

var processSinglePage = function() {
		var name      = $('.pic img').prop('alt')
		  , names     = name.split('/')
		  , firstName = names[0]
		  , result

		searchMovie(firstName).then(function(data) {
			if (data.count === 0) {
				result = '豆瓣没找到结果'
			} else {
				var subject = data.subjects[0]
				  , rating  = subject.rating.average
				  , poster  = subject.images.large
				  , url     = subject.alt

				result = '<a href="' + url + '">豆瓣评分' + rating + '</a>'
			}

			result = $('<div>').html(result);

			$('.info').eq(0).append(result);
		});
}

switch(true) {
	case /\/Html\/\w+\.html/.test(location.pathname):
		processSinglePage();
		break;
}


