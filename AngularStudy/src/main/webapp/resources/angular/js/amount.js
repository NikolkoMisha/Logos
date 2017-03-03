app.controller("amountController", function($scope, $http, $httpParamSerializer, amountUrl){
    $scope.currentView = "table";
    $scope.items = {content:[]};
    $scope.pages = [];
    $scope.pageSizes = [1,5,10];
    $scope.currentPage = 1;
    $scope.size = 10;
    $scope.sort;
    $scope.search = "";
    $scope.pageSorts = [{name:'amount', param:'amount'},
                       {name:'amount desc', param:'amount,desc'},
                       {name:'ingredient name', param:'ingredient.name'},
                       {name:'ingredient name desc', param:'ingredient.name,desc'},{name:'system name', param:'system.name'},
                       {name:'system name desc', param:'system.name,desc'}
                       ];
    $scope.ingredients=[];
    $scope.measuringSystems=[];
    
    $scope.refreshData = function(){
        $http.get("/ingredient").then(function(result){
            $scope.ingredients = result.data;
        });
        $http.get("/ms").then(function(result){
            $scope.measuringSystems = result.data;
        });
    }
    
    $scope.refreshData();
    
    $scope.changeSort = function(pageSort){
        $scope.sort = pageSort;
        $scope.refresh();
    }
    
    $scope.changeSize = function(size){
        $scope.size = size;
        $scope.refresh();
    }
    
    $scope.firstPage = function(){
        if($scope.currentPage!=1){
            $scope.currentPage = 1;
            $scope.refresh();
        }
    }
    
    $scope.previousPage = function(){
        if($scope.currentPage!=1){
            $scope.currentPage = $scope.currentPage-1;
            $scope.refresh();
        }
    }
    
    $scope.nextPage = function(){
        if($scope.currentPage!=$scope.items.totalPages){
            $scope.currentPage = $scope.currentPage+1;
            $scope.refresh();
        }
    }
    
    $scope.lastPage = function(){
        if($scope.currentPage!=$scope.items.totalPages){
            $scope.currentPage = $scope.items.totalPages;
            $scope.refresh();
        }
    }
    
    
    
    $scope.changePage = function(page){
        if($scope.currentPage!=page){
            $scope.currentPage=page;
            $scope.refresh();
        }
    }
    
    $scope.buildPages = function(){
        var start = ($scope.currentPage-2) >= 1 ? ($scope.currentPage-2) : 1;
        var finish = ($scope.currentPage+2) <= $scope.items.totalPages ? ($scope.currentPage+2) : $scope.items.totalPages;
        start = (finish - start < 5) ? (finish - 6) : start;
        start = start <= 0 ? 1 : start;
        finish = (finish - start) < 5 ? start + 4 : finish;
        finish = finish > $scope.items.totalPages ? $scope.items.totalPages : finish;
        $scope.pages = [];
        for(; start<=finish; start++){
            $scope.pages.push(start);
        }
    }
    
    $scope.$watch('currentView', function(oldValue, newValue, scope){
        if(oldValue=="table"){
            $scope.refresh();
        }
    });
    
    $scope.$watch('search', function(oldValue, newValue, scope){
        $scope.refresh();
    });
    
    function buildParams(){
        var config = {page:$scope.currentPage, size:$scope.size};
        if($scope.sort){
            config.sort=$scope.sort;
        }
        if($scope.search){
            config.search=$scope.search;
        }
        return "?"+$httpParamSerializer(config);
    }
    
    $scope.refresh = function () {
        $http.get(amountUrl+buildParams()).then(function (result) {
            $scope.items = result.data;
            console.log(result.data);
            $scope.buildPages();
        });
    }
    $scope.create = function (item) {
        console.log(angular.toJson(item));
        $http.post(amountUrl, angular.toJson(item)).then(function (result) {
            $scope.currentView = "table";
        });
    }
    $scope.update = function (item) {
        $http({
            url: amountUrl+"/" + item.id,
            method: "PUT",
            data: angular.toJson(item)
        }).then(function (modifiedItem) {
            $scope.currentView = "table";
        });
    }
    $scope.delete = function (item) {
        $http({
            method: "DELETE",
            url: amountUrl+"/" + item.id
        }).then(function () {
            $scope.refresh();
        });
    }
    $scope.editOrCreate = function (item) {
        $scope.currentItem = item ? angular.copy(item) : {};
        $scope.currentView = "edit";
    }
    $scope.cancelEdit = function () {
        $scope.currentItem = {};
        $scope.currentView = "table";
    }
    $scope.saveEdit = function (item) {
        if (angular.isDefined(item.id)) {
            $scope.update(item);
        } else {
            $scope.create(item);
        }
    }
//    $scope.refresh();
});