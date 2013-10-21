(function () {
  var render = function (data) {
    console.log(data);
  };
  $.ajax({
    type: 'GET',
    url: 'http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json',
    jsonp: 'callback',
    jsonpCallback: 'render',
    dataType: 'jsonp',
    contentType: 'application/json'
  }).done(function (data) {
      console.log(data);
    });
})();