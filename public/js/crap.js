crap:


// If you are not logged in, this will redirect you to the signup page
myApp.run( function($rootScope, $location, $cookieStore) {
    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (!$rootScope.user) {
            if(!$cookieStore.get('user')) {
                    // no logged user, we should be going to #login
                    if (next.templateUrl == "partials/login.html" || next.templateUrl == "partials/signup.html") {
                  // already going to #login, no redirect needed
              } 
              else {
                  // not going to #login, we should redirect now
                  $location.path( "/signup" );
              } 
          } 
            // If you do have a user saved in the cookie store, then rootScope.user = cookieStore
        } 
        else {
            $rootScope.user = $cookieStore.get('user');
        }
    });
});

myApp.run (function($rootScope, $location, $http) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if (!$rootScope.user) {
            if (next.templateUrl == "partials/login.html" || next.templateUrl == "partials/signup.html") {
            } else {
                $http({
                    method: 'GET',
                    url: '/api/isLoggedin'
                }).success(function (data, status, headers, config) {
                    if(data) {
                        // Saves the user to rootScope
                        console.log('got user!');
                        $rootScope.user = data;
                        console.log($rootScope.user);
                    } else {
                        console.log('should redirect!');
                        $location.path("/login");
                    }
                }).error(function (data, status, headers, config) {
                    console.log('error');
                });
            }
        }
    });
});
