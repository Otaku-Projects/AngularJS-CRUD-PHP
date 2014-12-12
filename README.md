#AngularJS-CRUD-PHP

A simple idea for Rapid application development

##Demo

coming soon... please wait

##Motivation

There were too many angularJS CRUD open source project in the real, angularJS has received significant recognition since recent years but we are still uncertainty what angularJS can and how much it can. Over the years, the numerous CRUD sample has been made, focus on routeProvider, angularJS <--> Java, angularJS <--> PHP. A vast amount of related work have been created by thousands of people from all over the world.

It is very limiting of my needs(maybe also yours). One day when a project need to provide CRUD on more than one table on one single page. But implement of such sample was copy and edit many lines of HTML. It was so tired and easy to make mistakes. I just want a simple and a lite angularJS controller to help us to develop on the small project.

<!--
##Features

- easy to provide Create, Read, Update Delete functions with a signal <crud> tag
- 
-->

##Requirement

- PHP 5.4 or above
- angularJS 1.3.0 or above
- jQuery 1.9.x or above
- bootstrap 3.3.0 or above (optional)

##Architecture

This project is divided into three parts, PHP core, angularJS and HTML template. PHP core handle the mysql query execution and return a json response, the core is develop under MVC model, view is jQuery+HTML before the angularJS.

AngulasJS provides the controller to send and receive the data between PHP, render different template for C/R/U/D. 

This project provide Create, Read, Update, Delete html page in default render template, the forms, the form controls are auto generate according to the table structure. You are enable to create and use your tailor template for specified table and CRUD action.

```
 Root
 ├---controller
 |    └--- PHP controller, handle business logic
 ├---js
 |    └--- angularJS app.js, controller.js
 ├---model
 |    └--- PHP model, role for communicate to MySQL server
 ├---Templates
 |    ├---crud
 |    |     └--- crud-action_type-table_name.html (customer template)
 |    ├--- crud-create.html (default create template)
 |    ├--- crud-read.html (default read template)
 |    ├--- crud-update.html (default update template)
 |    ├--- crud-delete.html (default delete template)
 ├---third-party
      ├---bootstrap-3.3.0
      └---angular.min.js
```

##Download
Download [ZIP](https://github.com/keithbox/AngularJS-CRUD-PHP/archive/master.zip) from GitHub

##Config
`model/DatabaseManager.php`
```
    protected		$hostname_fyp = "localhost";
    protected		$database_fyp = "mysql_database_name";
    protected		$username_fyp = "mysql_login_ID";
    protected		$password_fyp = "mysql_password";
```
`js/controllerCRUD.js`
```
    $rootScope.webRoot = "//www.example.com/";
```

##Contributing
Please do not hesitate to perform your professional on PULL requests when you found out some current insufficient. I am  apologise in advance for my working places not convenient to use GitHub frequently, my work may sticking around a month or waiting a great enhancement and then will batch update at here. For any good ideas who would nice reduce the user configuration, reduce the implementation coding, minimize the back end coding with a better algorithm, improve this little project are much welcome. I will follow the action on pull requests and issues at once.

## License
This project is licensed under the MIT license. [View license file](https://github.com/keithbox/AngularJS-CRUD-PHP/blob/master/license)
=]
