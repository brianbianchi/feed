(function (angular){
  'use strict';

  angular.module('feedApp', ['sky', 'ngSanitize'])
  .controller('FeedController', ['FeedService', function(Feed) {
    var feed = this;
    feed.subs = [
    {source:'Reddit Front Page', url:'https://www.reddit.com/.rss'},
    {source:'Google Trending', url:'https://trends.google.com/trends/hottrends/atom/hourly'}];
    feed.pages = [];

    feed.addFeed = function() {
      feed.subs.push({source:feed.feedUrl, url:feed.feedUrl});
      feed.feedUrl = '';
      feed.displayFeed();
    };

    feed.removeFeed = function(removeSub) {
      var oldSubs = feed.subs;
      feed.subs = [];
      angular.forEach(oldSubs, function(page) {
        if (page != removeSub) feed.subs.push(page);
      });
      feed.displayFeed();
    };

    feed.displayFeed = function() {
      angular.forEach(feed.subs, function(key, val) {
        console.log("key="+ key +", val="+ val +", url="+ key.url);
        Feed.parseFeed(key.url)
        .then(function (res) {
          feed.pages.push(res.items);
        });
        console.log(feed.pages);
      })
    }

    feed.displayFeed();

  }]);

  angular.module('feedApp').factory('FeedService', ['$http', function ($http) {
    return {
      parseFeed: function (url) {
        return $http.jsonp('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url)).then(function (res) {
          return res.data;
        })
        .catch(function (err) {console.log(err); return null;});
      }
    }
  }]);

  angular.module('feedApp').config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  });


})(angular);