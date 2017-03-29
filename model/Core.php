<?php
class CustomException extends Exception {}

if (!file_exists(BASE_RESOURCE)) mkdir(BASE_RESOURCE, 0777, true);
if (!file_exists(BASE_TEMPORARY)) mkdir(BASE_TEMPORARY, 0777, true);
if (!file_exists(BASE_UPLOAD)) mkdir(BASE_UPLOAD, 0777, true);
if (!file_exists(BASE_EXPORT)) mkdir(BASE_EXPORT, 0777, true);
if (!file_exists(BASE_WORD_TEMPLATE)) mkdir(BASE_WORD_TEMPLATE, 0777, true);

?>