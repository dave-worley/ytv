(function () {
  var VideoEntry, VideoList, VideoEntryView, VideoListView;
  VideoEntry = Backbone.Model.extend({
    defaults: {
      id: '',
      link: '',
      title: ''
    }
  });
  VideoList = Backbone.Collection.extend({
    model: VideoEntry
  });
  VideoEntryView = Backbone.View.extend({
    tagName: 'div',
    className: 'vitem col-md-3',
    template: _.template($('#item-template').html()),
    initialize: function () {
      _.bindAll(this, 'render');
      this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    }
  });
  VideoListView = Backbone.View.extend({
    el: $('#popular-items'),
    initialize: function () {
      _.bindAll(this, 'render');
      this.collection = new VideoList();
      this.listenTo(this.collection, 'add', this.render);
      this.render();
    },
    render: function () {
      var renderedViews, html;
      renderedViews = this.collection.map(function (entry) {
        var videoview = new VideoEntryView({
          model: entry
        });
        return videoview.render().$el;
      });
      html = '<div class="row">';
      _.each(renderedViews, function (el, index, list) {
        html += el.html();
        if (index === list.length - 1) {
          html += '</div>';
        } else if ((index + 1) % 4 === 0 && index > 0) {
          html += '</div><div class="row">';
        }
      });
      this.$el.html(html);
    }
  });

  var render = function (data) {
    var entries, ListView;
    entries = data['feed']['entry'];
    ListView = new VideoListView();
    _.each(entries, function (entry, index, list) {
      var videoentry, id;
      id = entry.id.$t;
      if (id.indexOf('tag:') !== -1) {
        id = _.last(id.split(':'));
      } else {
        id = _.last(id.split('/'));
      }
      videoentry = new VideoEntry({
        id: id,
        link: entry.link[0].href,
        title: entry.title.$t
      });
      ListView.collection.add(videoentry);
    });
  };
  $.getJSON('http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json&callback=?', function (data) {
    render(data);
  });
  $('#searchform').on('submit', function (evt) {
    evt.preventDefault();
    $.getJSON('http://gdata.youtube.com/feeds/api/videos?q=' + $(this).find('#searchval').val() + '&alt=json-in-script&max-results=30&format=5&callback=?', function (data) {
      render(data);
    });
  });
})();