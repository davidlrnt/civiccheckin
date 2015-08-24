angular.module('new-entity', ['ui.bootstrap'])
.controller('homeCtrl', function($scope, $http) {
	console.log("loaded")
	$scope.newEntity = {};
    $scope.addressSearch = function(search) {
        return $http.jsonp('http://dev.virtualearth.net/REST/v1/Locations', {params: {query: search, key: 'Ai58581yC-Sr7mcFbYTtUkS3ixE7f6ZuJnbFJCVI4hAtW1XoDEeZyidQz2gLCCyD', 'jsonp': 'JSON_CALLBACK', 'incl': 'ciso2'}})
            .then(function(response) {
                return response.data.resourceSets[0].resources
            });
    }
    $scope.submit = function(){
	   $("#step1").animate({
	    opacity: 0.25,
	    // left: "+=50",
	    height: "toggle"
	  }, 1000, function() {
	  	$("#step2").animate({
	    opacity: 1,
	    left: "+=50",
	    height: "toggle"
	  }, 1000, function() {
	  });
 	 });
    };
    $scope.add = function(){
    $('#step2').animate({
	    opacity: 0.25,
	    left: "+=50",
	    height: "toggle"
	  }, 1000, function() {
		$("#step3").animate({
		opacity: 1,
		// left: "+=50",
		height: "toggle"
		}, 200, function() {
		function refresh() {
			$scope.newEntity = {};
			// newEntity = {};
			// $('#nEntityForm').reset();	
			document.getElementById("nEntityForm").reset();
			$("#step3").animate({
			opacity: 0.25,
			left: "+=50",
			height: "toggle"
			}, 1000, function() {
			$("#step1").animate({
			opacity: 1,
			left: "+=50",
			height: "toggle"
			}, 1000, function() {
				console.log($scope.newEntity)

			});
			});
		};
			setTimeout(refresh, 2000);
		})
	  });
    };
    $scope.isValid = function(){
    	var valid = false;
    	if ($scope.newEntity.name && $scope.newEntity.location && $scope.newEntity.type){
    		valid = true;
    	}
    	return valid
    };

	$http.get('http://172.31.98.241:5000/api/entities')
        .success(function(data) {
        	console.log(data)
            $scope.entities = data.nodes;
            var locations = _.uniq(_.pluck(_.flatten(_.pluck($scope.entities, 'locations')), 'locality'));

            var entitiesByLocation = _.map(locations, function(loc){
                var findings = _.filter($scope.entities, _.flow(
                                 _.property('locations'),
                                 _.partialRight(_.any, { locality : loc })
                               ));

                return {
                    name: loc,
                    type: 'location',
                    entities: findings,
                    dict: _.zipObject(_.pluck(findings, 'name'), _.pluck(findings, 'index'))
                }
            });
            $scope.searchItems = entitiesByLocation.concat($scope.entities); 
        });
})