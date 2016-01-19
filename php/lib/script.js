(function () {
    var app = angular.module('StudentInfo', []);

    var Student = function (res) {
        return {
            student_name: res.student_name,
            student_id: parseInt(res.student_id),
            regno: parseInt(res.regno),
            cgpa: parseFloat(res.cgpa),
        };
    };

    //
    // CONTROLLERS
    //
    app.controller('AppController', ['$http', function ($http) {

        var $scope = this;
        $scope.error = "";
        $scope.studentList = [];
        $scope.student = {};
        $scope.backupStudent = {};
        $scope.tableDesc = [
            ["student_id", "#ID", "int, primary key, not null, auto incremented"],
            ["student_name", "Student name", "varchar(100)"],
            ["regno", "Registration number", "number(10)"],
            ["cgpa", "CGPA", "decimal(4,2)"]
        ];
        $scope.$sortOrder = 0;
        $scope.$lastSort = $scope.tableDesc[0][0];

        // server requests
        //
        $scope.refreshList = function () {
            var req = $http.post("list.php");
            req.success(function (res) {
                if (!res.result) {
                    $scope.error = res.error ? res.error : res;
                }
                else {
                    $scope.error = "";
                    $scope.studentList = [];
                    res.result.forEach(function (data) {
                        $scope.studentList.push(Student(data));
                    });
                }
            });
            req.error(function (err) {
                $scope.error = err;
            });
        };

        // Create student
        //
        $scope.addStudent = function () {
            var req = $http.post("add.php", $scope.student);
            req.success(function (res) {
                console.log(res);
                if (!res.hasOwnProperty("result")) {
                    $scope.error = res.error ? res.error : res;
                }
                else {
                    $scope.error = "";
                    $scope.studentList.push(Student(res.result));
                    $("#addStudent").modal('hide');
                    $scope.student = {};
                }
            });
            req.error(function (err) {
                $scope.error = err;
            });
        };

        // Update student
        //
        $scope.beginEdit = function (student) {
            $scope.student = student;
            $scope.backupStudent.student_name = student.student_name;
            $scope.backupStudent.regno = student.regno;
            $scope.backupStudent.cgpa = student.cgpa;
            $("#editStudent").modal('show');
        };

        $scope.editStudent = function () {
            var req = $http.post("edit.php", $scope.student);
            req.success(function (res) {
                console.log(res);
                if (!res.result) {
                    $scope.error = res.error ? res.error : res;
                }
                else {
                    $scope.error = "";
                    res.result = Student(res.result);
                    $scope.student.student_name = res.result.student_name;
                    $scope.student.regno = res.result.regno;
                    $scope.student.cgpa = res.result.cgpa;
                    $("#editStudent").modal('hide');
                    $scope.student = {};
                }
            });
            req.error(function (err) {
                $scope.error = err;
                $scope.student.student_name = $scope.backupStudent.student_name;
                $scope.student.regno = $scope.backupStudent.regno;
                $scope.student.cgpa = $scope.backupStudent.cgpa;
            });
        };

        // Delete student
        //
        $scope.beginDelete = function (student) {
            $scope.student = student;
            $("#deleteStudent").modal('show');
        };

        $scope.deleteStudent = function () {
            var req = $http.post("delete.php", $scope.student);
            req.success(function (res) {
                if (!res.result) {
                    $scope.error = res.error ? res.error : res;
                }
                else {
                    $scope.error = "";
                    var index = $scope.studentList.indexOf($scope.student);
                    $scope.studentList.splice(index, 1);
                    $("#deleteStudent").modal('hide');
                    $scope.student = {};
                }
            });
            req.error(function (err) {
                $scope.error = err;
            });
        };

        // Query database
        //
        $scope.queryDatabase = function () {
            var req = $http.post("query.php", {query: $scope.queryData});
            req.success(function (res) {
                if (!res.result) {
                    $scope.error = res.error ? res.error : res;
                }
                else {
                    $scope.error = "";
                    $scope.studentList = res.result;
                    $scope.error = $scope.queryData;
                }
            });
            req.error(function (err) {
                $scope.studentList = [];
                $scope.error = err;
            });
            $("#queryDatabase").modal('hide');
        };

        // some other functions
        //
        $scope.canShow = function (student) {
            if ($scope.filterText && $scope.filterText.length > 0) {
                var str = $scope.filterText.toLowerCase().trim();
                if (student.cgpa == str) return true;
                var reg = student.regno.toString().toLowerCase();
                if (reg == str || reg.startsWith(str)) return true;
                var name = student.student_name.toLowerCase();
                return name.search(str) >= 0;
            }
            return true;
        };

        $scope.getGrade = function (cgpa) {
            if (cgpa >= 4.00) return "A+";
            else if (cgpa >= 3.75) return "A";
            else if (cgpa >= 3.50) return "A-";
            else if (cgpa >= 3.25) return "B+";
            else if (cgpa >= 3.00) return "B";
            else if (cgpa >= 2.75) return "B-";
            else if (cgpa >= 2.50) return "C+";
            else if (cgpa >= 2.25) return "C";
            else if (cgpa >= 2.00) return "C-";
            else return "F";
        };

        $scope.getAverage = function () {
            if (!$scope.studentList || $scope.studentList.length == 0)
                return "Unknown";
            var total = 0.0;
            $scope.studentList.forEach(function (s) {
                total += s.cgpa;
            });
            var res = total / $scope.studentList.length;
            res = Math.ceil(res * 100) / 100.0;
            return res + " (" + $scope.getGrade(res) + ")";
        };

        $scope.sortStudent = function (colName) {
            if (!$scope.studentList) return;
            if ($scope.$lastSort == colName) {
                $scope.$sortOrder = 1 - $scope.$sortOrder;
            }
            else {
                $scope.$sortOrder = 0;
            }
            $scope.studentList.sort(function (a, b) {
                if ($scope.$sortOrder == 0) //ascending
                    return a[colName] > b[colName];
                else //descending
                    return a[colName] < b[colName];
            });
            $scope.$lastSort = colName;
        };

        // load student list at startup
        //
        $scope.refreshList();
    }]);


    //
    // DIRECTIVES
    //
    app.directive('addStudent', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/add-student.html'
        };
    });

    app.directive('editStudent', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/edit-student.html'
        };
    });

    app.directive('deleteStudent', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/delete-student.html'
        };
    });

    app.directive('studentTable', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/student-table.html'
        };
    });

    app.directive('studentOverview', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/student-overview.html'
        };
    });

    app.directive('studentNavbar', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/student-navbar.html'
        };
    });

    app.directive('queryDatabase', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/query-database.html'
        };
    });

    app.directive('studentFormContent', function () {
        return {
            restrict: 'E',
            templateUrl: 'component/student-form-content.html'
        };
    });

})();