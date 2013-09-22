var myAppModule = angular.module('MyApp', []);

myAppModule.controller('TwitterCtrl', function($scope, $http, $timeout) {
    $scope.twitterFeed = [];
    $scope.tweets = [];    

    for (var key in localStorage) {
        $scope.twitterFeed.push(key);
    }

    $scope.getTweets = function() {             
        var hash = $scope.newTweet;
        var timer = $scope.timer;

        if ($scope.tim) {
            clearTimeout($scope.tim);
        }
        if (localStorage[hash]) {
            var data = localStorage[hash];
            $scope.tweets = JSON.parse(data);
        } else {
            $scope.placeholder = {text: 'getting tweets...'};            
            
                $scope.twitterFeed.push($scope.newTweet);
            
            $http.get('./TwitterScraper.php', {params: {hash: $scope.newTweet}}).success(function(data, status, headers, config) {
                $scope.tweets = data;
                if (data.length == 0) { 
                    $scope.placeholder = {text: 'no tweets found :('};
                    $scope.twitterFeed.pop();                    
                } else {
                    if (timer) {                        
                        $scope.timeIsSet = true;
                        $scope.tim = setTimeout(setTimer, timer*1000);            
                    }                                            
                    $scope.placeholder = {text: ''};
                    localStorage.setItem(hash, JSON.stringify(data));
                }
            });            
        }
        $scope.newTweet = '';
        
        //start of setTimer
        var setTimer = function () {
            console.log('called');
            $http.get('./TwitterScraper.php', {params: {hash: hash}}).success(
                function(data, status, headers, config) {
                        $scope.tweets = data;
                        localStorage.setItem(hash, JSON.stringify(data));
                        $scope.tim = setTimeout(setTimer, timer*1000);               
                });  
        }//end of setTimer

        $scope.stopTimer = function () {
            clearTimeout($scope.tim);
            $scope.timeIsSet = false;
        }

    }//end of $scope.getTweets function       
});//end of TwitterCtrl Controller

myAppModule.controller('LocalStorageCtrl', function($scope) {
    $scope.clear = function () {
        localStorage.clear();
        $scope.twitterFeed.length = 0;
        $scope.tweets.length = 0;
        $scope.$parent.placeholder = {text: ''};
        $scope.timeron = '';
    }

    $scope.getLocalStorage = function($index) {
        var key = $scope.twitterFeed[$index];
        var data = localStorage[key];
        $scope.$parent.tweets = JSON.parse(data);
        $scope.$parent.scroll = 'scroll';
    }
});