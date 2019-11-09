# AngularJS-CRUD-PHP

![](https://img.shields.io/github/license/keithbox/AngularJS-CRUD-PHP.svg?style=flat)
![](https://img.shields.io/github/release/keithbox/AngularJS-CRUD-PHP.svg?style=flat)
[![Build Status](https://scrutinizer-ci.com/g/Otaku-Projects/AngularJS-CRUD-PHP/badges/build.png?b=master)](https://scrutinizer-ci.com/g/Otaku-Projects/AngularJS-CRUD-PHP/build-status/master)
[![codebeat badge](https://codebeat.co/badges/a02dfe82-6622-4c7b-8f9e-c8141b217d77)](https://codebeat.co/projects/github-com-keithbox-angularjs-crud-php-master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Otaku-Projects/AngularJS-CRUD-PHP/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Otaku-Projects/AngularJS-CRUD-PHP/?branch=master)
![](https://img.shields.io/github/languages/top/keithbox/AngularJS-CRUD-PHP.svg?style=flat)
![](https://img.shields.io/github/languages/count/keithbox/AngularJS-CRUD-PHP.svg?style=flat)

I often develop the ERP system with Agile methodologies, such as Rapid application development, this project is a simple idea for reduces the coding effort on both of client and server side. In my case, I use php and mysql as server side dependency, you need to play some coding effort if you have your own server side languages.

In current stage, I am going to perform Code refactoring and add some new features, it may take a long duration.

## Motivation
There were too many angularJS CRUD open source project in the real, angularJS has received significant recognition since recent years but we are still uncertainty what angularJS can and how much it can. Over the years, the numerous CRUD sample has been made, focus on routeProvider, angularJS <--> Java, angularJS <--> PHP. A vast amount of related work have been created by thousands of people from all over the world.

It is very limiting of my needs(maybe also yours). One day when a project need to provide CRUD on more than one table on one single page. But implement of such sample was copy and edit many lines of HTML. It was so tired and easy to make mistakes. I just want a simple and a lite angularJS controller to help us to develop on the small project.

The project use the basic concept of AngularJS to design the reusable components, provide with flexible design to add new functions or customize the layout if you like.

## Download
Go to [released version](https://github.com/Otaku-Projects/AngularJS-CRUD-PHP/releases) on GitHub

## v2 Documentation
[Go here](http://otaku-projects.github.io/AngularJS-CRUD-PHP/doc/v2/)  
The document includes the below topic:  
- Installation Guide
- Configuration
- System Spec. - Architecture
- System Spec. - Diagrams
- Third-party Dependency
- API Reference

## v2 Demonstration
Due to limited resources, unable to provide an active database to demonstrate online, please follow the document, install the project on the PC to run the demonstration pages (webroot/demo/v2).

## Architecture

This project is divided into three parts, PHP core, angularJS and HTML template. PHP core handle the mysql query execution and return a json response, the core is develop under MVC model, view is jQuery+HTML+angularJS.

### Ideally Design

AngulasJS provides the directive to deisgn a custom html element/attribute, \<entry\> \<pageview\> \<screen\> \<editbox\> \<import-export\> are the directive.

This project design for the function base, a page can be a function, a directive can be a function, a page allowed to provide multi directive.
\<entry\> directive handle the action of [Create | View | Update | Delete] of any entries.
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
- [x] Using ui-router

In the future, some existing problems must be solved
- [ ]  Better handling for one to many relationship between the parent and the child table.
- [ ]  Rewrite the \<pageview\> coding
- [ ]  review the data flow of directives

### System Architecture
```
 Root
 ├---demo\
 |    ├--- v2\ (v2 demo)
 |    └--- v3\ (v3 demo)
 ├---doc\
 |    ├--- v2\ (v2 docs)
 |    └--- v3\ (v3 docs)
 ├---config\
 |    ├--- config.js (client config)
 |    └--- config.php (server config)
 ├---js
 |    ├--- app.initial.js ( angularJS core )
 |    ├--- app.route.config.js ( optional, use ui-router to reduce development effort ) 
 |    ├--- directive.*.js ( entry, editbox, pageview, range, screen, message and other directives )
 |    └--- service.js ( common shared service, e.g LoadingModal, MessageService, $http, etc. )
 ├---core (system core)
 |    ├--- core.connection.manager.php (centralize the HTTP request and HTTP response)
 |    ├--- DatabaseManager.php (execute sql query, provide insert(), select(), update(), delete() for TableManager to access MySQL DB)
 |    └---... and so on 
 ├---controller (files is functional based, file may includes business logic)
 |    ├--- EntryAControllerA.php ( business rules of the entry )
 |    └--- EntryAControllerB.php (              .              )
 |    ├--- EntryBControllerC.php (              .              )
 |    ├--- EntryBControllerD.php (              .              )
 |    └--- EntryNControllerN.php ( business rules of the entry )
 ├---model (files is table/data entry based, file may include business logic)
 |    └--- TableAManager.php
 |    └--- TableBManager.php
 |    └--- TableCManager.php
 ├---Templates\screen
 |    ├--- entry.html ( entry directive optional template)
 |    └--- pageview.html ( pageview directive optional template)
 ├---third-party (please refer to the dependency)
 |    ├---angular
 |    ├---jQuery
 |    ├---bootstrap
 |    └---... and so on 
 ├---vendor (please refer to the composer dependency)
```

### Used on Projects
This project good for the small website project that within or around 30 pages.

[Passive-Investment-Management-System](https://github.com/keithbox/Passive-Investment-Management-System) (Sep 2018), manage and provide the views of certificate deposit, exchange and stocks. Using a new generation of Core.

[NoSQLSystem](https://github.com/keithbox/NoSQLSystem) (Aug 2017), a branch of this one and practice for a website that using MongoDB database

[PPSP-360_Degree_Evaluation_System](https://github.com/keithbox/PPSP-360_Degree_Evaluation_System) (Mar 2017), a branch of this one and practice for an E-Appraisal system.

## Contributing
Please do not hesitate to perform your professional on PULL requests when you found out some current insufficient. I am apologise in advance for my working places not convenient to use GitHub frequently, my work may sticking around a month or waiting a great enhancement and then will batch update at here. For any good ideas who would nice reduce the user configuration, reduce the implementation coding, minimize the back end coding with a better algorithm, improve this little project are much welcome. I will follow up the pull requests and issues at once.

## License
This project is licensed under the MIT license. [View license file](https://github.com/Otaku-Projects/AngularJS-CRUD-PHP/blob/master/LICENSE)
=]
