# AngularJS-CRUD-PHP

<a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>

A simple idea for Rapid application development, this sample use php and mysql as server side dependency, you need to play some coding effort if you does not.

In current stage, I am going to perform Code refactoring and add some new features, it may take a long duration.

## Demo
Sorry about that I cannot provide a sample that can access the database.  
For quick view how to use/reuse the source, please check the [online documentation](http://keithbox.github.io/AngularJS-CRUD-PHP/demo/index.html)

For further study, please follow the documentation to setup the demo case on your local environment.

[PPSP-360_Degree_Evaluation_System](https://github.com/keithbox/PPSP-360_Degree_Evaluation_System), a branch of this one and practice for an E-Appraisal system.

[NoSQLSystem](https://github.com/keithbox/NoSQLSystem), a branch of this one and practice for a website that using MongoDB database

In my try, this project good for the small website project that within or around 30 pages.

## Motivation
There were too many angularJS CRUD open source project in the real, angularJS has received significant recognition since recent years but we are still uncertainty what angularJS can and how much it can. Over the years, the numerous CRUD sample has been made, focus on routeProvider, angularJS <--> Java, angularJS <--> PHP. A vast amount of related work have been created by thousands of people from all over the world.

It is very limiting of my needs(maybe also yours). One day when a project need to provide CRUD on more than one table on one single page. But implement of such sample was copy and edit many lines of HTML. It was so tired and easy to make mistakes. I just want a simple and a lite angularJS controller to help us to develop on the small project.

## Dependency
### Framework, library on web client
- angularJS 1.5.0 or above
- jQuery 2.2.1 or above

if you want the import/export features
- ng-file-upload-12.2.12 or above
- Blob.js
- FileSaver.js 1.3.2

ui framework, the default ui components that i used, you may switch to others
- bootstrap 3.3.0 or above (optional)
- font awesome 4.5.0 or above (optional)

### Framework, library on server side
- PHP 5.4 or above
- PHPExcel 1.8.1 (excel engine)
- mpdf 6.1.3 (pdf engine)
- OfficeToPdf.exe (pdf engine) [Requirement](https://officetopdf.codeplex.com/)

PHPExcel has integrate with dompdf, mpdf, tcpdf, but the excel convert to pdf features has some limitations, I recommended to use OfficeToPdf if your server environment is windows platform

## Architecture

This project is divided into three parts, PHP core, angularJS and HTML template. PHP core handle the mysql query execution and return a json response, the core is develop under MVC model, view is jQuery+HTML+angularJS.

### Ideally Design

AngulasJS provides the \<entry\> \<pageview\> \<screen\> \<editbox\> \<import-export\> directive, entry directive handle the action of [Create | View | Update | Delete] of any entries.

This project design for the function base, a page can be a function, a directive can be a function, a page allowed to provide multi directive.
\<pageview\> directive is a directive used to display a records set.
\<screen\> directive is a template directive for reuseable \<pageview\>, \<screen\> also work for \<entry\>.
\<editbox\> to handle foreign key on the \<entry\>, allowed to open a \<pageview\> to find the tuple from the foreign table. select a tuple to assign the FK to the field of the \<entry\>, the further information of the selected FK record may display in the \<editbox\>.

## Functional Implementation
- [x] \<entry\> provide CRUD action
- [x] \<pageview\> display the records set in pagination
- [x] \<screen\> as a template directive for reuseable \<pageview\>, \<entry\>
- [x] \<editbox\> is a control set to handle foreign key, click to popup a \<pageview\> to find the tuple from the foreign table. select a tuple to assign the FK to the field of the \<entry\>, the further information of the selected FK record may display in the \<editbox\>.
- [x] \<export\> convert the responded Base64 to a Blob object and download to the client
- [x] \<upload\> send one or more file to the server
- [x] \<import\> send the uploaded file location with specify action to do some process
- [x] \<message\> separate the process result message from CRUD, import, or export directive, centralize to display in here
- [x] \<range\> a combination of two editbox, for report, inquiry or process criteria
- [x] \<process\> to preform reporting, inquiry, processing action

In the future, some existing problems must be solved
- [ ]  \<pageview\> can be a selection range for the search criteria selection.
- [ ]  Better handling for one to many relationship between the parent and the child table.
- [ ]  Using ngRoute so that the user can point to single one record by a unique URL.
- [ ]  Rewrite the \<pageview\> coding
- [ ]  review the data flow of directives

### System Architecture
```
 Root
 ├---js
 |    ├--- config.js ( config of app.js )
 |    ├--- app.js ( angularJS core)
 |    ├--- directive.js ( angularJS directive )
 |    └--- service.js ( common service, e.g $http )
 ├---controller
 |    └--- EntryAControllerA.php ( business rules of the entry )
 ├---model (role for communicate to MySQL server)
 |    ├--- ConnectionManager.php (centralize the HTTP request and HTTP response)
 |    ├--- DatabaseManager.php (execute sql query, provide insert(), select(), update(), delete() for TableManager to access MySQL DB)
 |    └--- TableAManager.php (inheritance to DatabaseManager.php, allow to overwrite the insert(), select(), update(), delete())
 ├---Templates
 |    ├--- entry.html ( entry directive optional template)
 |    └--- pageview.html ( pageview directive optional template)
 ├---third-party
      ├---angular.min.js
      ├---jQuery
      ├---bootstrap-3.3.0
      └---... and so on (please refer to the dependency)
```
![System Architecture Design](./System%20Architecture.png)

## Download
Go to [released version](https://github.com/keithbox/AngularJS-CRUD-PHP/releases) on GitHub

## Documentation
[Go here](http://keithbox.github.io/AngularJS-CRUD-PHP/demo/index.html)  
The document includes the:  
- Installation Guide
- Configuration
- API Reference
- Demo Cases

## Contributing
Please do not hesitate to perform your professional on PULL requests when you found out some current insufficient. I am  apologise in advance for my working places not convenient to use GitHub frequently, my work may sticking around a month or waiting a great enhancement and then will batch update at here. For any good ideas who would nice reduce the user configuration, reduce the implementation coding, minimize the back end coding with a better algorithm, improve this little project are much welcome. I will follow the action on pull requests and issues at once.

## License
This project is licensed under the MIT license. [View license file](https://github.com/keithbox/AngularJS-CRUD-PHP/blob/master/LICENSE)
=]
