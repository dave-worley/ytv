(function () {
  var render = function (data) {
    var entries, itemTemplate, html;
    entries = data['feed']['entry'];
    itemTemplate = _.template($('#item-template').html());
    html = '<div class="row">';
    _.each(entries, function (entry, index, list) {

      var d = {
        id: _.last(entry.id.$t.split(':')),
        link: entry.link[0].href,
        title: entry.title.$t
      };
      html += itemTemplate(d);
      if (index === list.length - 1) {
        html += '</div>';
      } else if ((index + 1) % 4 === 0 && index > 0) {
        html += '</div><div class="row">';
      }
    });
    html += '<br class="clearfix"/>';
    $('#popular-items').html(html);
  };
  $.getJSON('http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json&callback=?', function (data) {
    render(data);
  });
})();