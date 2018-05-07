(function (angular) {
  'use strict';

  angular.module('feedApp')
    .controller('FeedController', ['FeedService', function (Feed) {

      var vm = this;

      vm.subs = [
        { title: 'Reddit Front Page', url: 'https://www.reddit.com/.rss' }];
      vm.pages = [];
      vm.popular = [
        { title: '/r/programming', url: 'https://www.reddit.com/r/programming/.rss' },
        { title: 'Hacker News', url: 'https://news.ycombinator.com/rss' },
        { title: 'A List Apart', url: 'https://feeds.feedburner.com/alistapart/main' },
        { title: 'NetTuts+', url: 'https://feeds.feedburner.com/nettuts' },
        { title: 'DZone', url: 'https://feeds.dzone.com/home?format=rss' },
        { title: 'The Guardian', url: 'https://www.theguardian.com/international/rss' },
        { title: 'NY Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml' },
        { title: 'Casey Neistat', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCtinbF-Q-fVthA0qrFQTgXQ' },
      ];

      /*
       * Adds a feed object to the subscriptions array.
       */
      vm.addSubscription = function (url) {
        vm.subs.push({ title: '', url: url });
        vm.findDuplicate();
        vm.displayFeed();
      }

      /*
       * Removes a feed object from the subscriptions array.
       */
      vm.removeSubscription = function (page) {
        var subArr = vm.subs;
        vm.subs = [];
        angular.forEach(subArr, function (subPage) {
          if (subPage != page) {
            vm.subs.push(subPage);
          } else {
            vm.addPopular(subPage.title, subPage.url);
          }
        });
        vm.displayFeed();
      }

      /*
       * Adds a feed object to the 'popular' subscriptions array.
       */
      vm.addPopular = function (title, url) {
        vm.popular.push({ title: title, url: url });
      }

      /*
       * Removes a feed object from the 'popular' subscriptions array.
       */
      vm.removePopular = function (page) {
        var popArr = vm.popular;
        vm.popular = [];
        angular.forEach(popArr, function (popPage) {
          if (popPage.url != page.url) {
            vm.popular.push(popPage);
          }
        });
      }

      /*
       * Removes a duplicate page from the 'popular' subscription array.
       */
      vm.findDuplicate = function () {
        angular.forEach(vm.popular, function (popPage) {
          angular.forEach(vm.subs, function (subPage) {
            if (popPage.url == subPage.url) {
              vm.removePopular(popPage);
            }
          });
        });
      }

      /*
       * Makes a Get request to each subscription and populates the 'pages' array with the response.
       */
      vm.displayFeed = function () {
        vm.pages = [];
        angular.forEach(vm.subs, function (key, val) {
          Feed.parseFeed(key.url)
            .then(function (res) {
              if (res.status == "ok") {
                for (var i = 0; i < res.items.length; i++) {
                  res.items[i].src = res.feed.title;
                  res.items[i].srclink = res.feed.link;
                  vm.pages.push(res.items[i]);
                  key.title = res.feed.title;
                }
              } else {
                alert("You have inserted an invalid rss url.");
                vm.removeSubscription(key);
              }
            });
        });
      }

      /*
       * Sort 'pages' array by date.
       */
      vm.dateSort = function () {
        vm.pages.sort(function (a, b) {
          return new Date(b.pubDate) - new Date(a.pubDate);
        });
      }

      /*
       * Re-order 'subs' and 'pages' arrays.
       */
      vm.orderSubs = function (topSub) {
        vm.subs.sort((x, xs) => xs.url === topSub.url);

        let titles = vm.subs.map(s => s.title);
        vm.pages.sort((x, xs) => titles.indexOf(x.src) - titles.indexOf(xs.src));
      }

      vm.displayFeed();

    }]);

})(angular);