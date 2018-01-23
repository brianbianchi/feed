(function (angular){
  'use strict';

  angular.module('feedApp', ['sky', 'ngSanitize'])
  .controller('FeedController', ['FeedService', function(Feed) {
    var feed = this;
    feed.subs = [];
    feed.popular = [
    {title:'Reddit Front Page', url:'https://www.reddit.com/.rss'},
    {title:'The Guardian', url:'https://www.theguardian.com/international/rss'},
    {title:'CNN', url:'http://rss.cnn.com/rss/cnn_topstories.rss'},
    {title:'NY Times', url:'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml'},
    {title:'youtube', url:'https://www.youtube.com/feeds/videos.xml?channel_id=UCBcRF18a7Qf58cCRy5xuWwQ'},
    ];
    feed.pages = [];

    feed.addFeed = function(feedurl) {
      feed.subs.push({title:'', url:feedurl});
      feed.feedUrl = '';
      feed.displayFeed();
      angular.forEach(feed.popular, function(popPage) {
        angular.forEach(feed.subs, function(subPage) {
          if (popPage.url == subPage.url) {
            feed.removeFeed(popPage, 'popular');
          }
        });
      });
    };

    feed.removeFeed = function(removePage, arr) {
      if (arr == 'subs') {
        var oldArr = feed.subs;
        feed.subs = [];
        angular.forEach(oldArr, function(page) {
          if (page != removePage) feed.subs.push(page);
        });
        feed.displayFeed();
      }
      else if (arr == 'popular') {
        var oldArr = feed.popular;
        feed.popular = [];
        angular.forEach(oldArr, function(page) {
          if (page.url != removePage.url) feed.popular.push(page);
        });
      }
    };

    feed.displayFeed = function() {
      feed.pages = [];
      angular.forEach(feed.subs, function(key, val) {
        Feed.parseFeed(key.url)
        .then(function (res) {
          if (res.status="ok") {
            feed.pages.push(res);
            key.title = res.feed.title;
          }
        });
      })
      console.log(feed.pages);
      console.log(feed.subs);
    }

    feed.displayFeed();

  }]);

  angular.module('feedApp').factory('FeedService', ['$http', function ($http) {
    return {
      parseFeed: function (url) {
        return $http.jsonp('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url))
        .then(function (res) { return res.data; })
        .catch(function (err) {console.log(err);});
      }
    }
  }]);

  // not best practice if this wasn't a static app
  angular.module('feedApp').config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  });


})(angular);