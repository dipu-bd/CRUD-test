(function () {
    var app = angular.module('StudentInfo', []);

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

    app.controller('AppController', ['$http', function ($http) {

        var $scope = this;
        $scope.error = "";
        $scope.studentList = [];
        $scope.student = {};
        $scope.backupStudent = {};

        $scope.refreshList = function () {
            var req = $http.get("/list");
            req.success(function (res) {
                $scope.error = res.error;
                $scope.studentList = res.result;
            });
            req.error(function (err) {
                $scope.error = err;
                $scope.studentList = [];
            });
        };

        $scope.addStudent = function () {
            var req = $http.post("/add", $scope.student);
            req.success(function (res) {
                $scope.error = res.error;
                if (!res.error) {
                    $scope.studentList.push(res.result);
                }
            });
            req.error(function (err) {
                $scope.error = err;
            });
            $("#addStudent").modal('hide');
        };

        $scope.beginEdit = function (student) {
            $scope.student = student;
            $scope.backupStudent.student_name = student.student_name;
            $scope.backupStudent.regno = student.regno;
            $scope.backupStudent.cgpa = student.cgpa;
            $("#editStudent").modal({});
        };

        $scope.editStudent = function () {
            var req = $http.post("/edit", $scope.student);
            req.success(function (res) {
                $scope.error = res.error;
                if (res.error) res.result = $scope.backupStudent;
                $scope.student.student_name = res.result.student_name;
                $scope.student.regno = res.result.regno;
                $scope.student.cgpa = res.result.cgpa;
                $scope.student = {};
                $("#editStudent").modal('hide');
            });
            req.error(function (err) {
                $scope.error = err;
            });
        };

        $scope.beginDelete = function (student) {
            $scope.student = student;
            $("#deleteStudent").modal({});
        };

        $scope.deleteStudent = function () {
            var req = $http.post("/delete", $scope.student);
            req.success(function (res) {
                $scope.error = res.error;
                if (!res.error) {
                    $scope.refreshList();
                }
                $scope.student = {};
                $("#deleteStudent").modal('hide');
            });
            req.error(function (err) {
                $scope.error = err;
            });
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
            var count = $scope.studentList.length;
            if (count == 0) return "Unknown";
            var total = 0.0;
            $scope.studentList.forEach(function (s) {
                total += s.cgpa;
            });
            var res = total / count;
            res = Math.ceil(res * 100) / 100.0;
            return res + " (" + $scope.getGrade(res) + ")";
        };

        $scope.getPassCount = function () {
            var total = 0;
            $scope.studentList.forEach(function (s) {
                if (s.cgpa >= 2.0) ++total;
            });
            return total;
        };

        $scope.refreshList();

    }]);
})();