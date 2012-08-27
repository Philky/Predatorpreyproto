Predator Prey
=============

Introduction
------------

Here is a version of Predator Pret using
[grunt.js](https://github.com/cowboy/grunt) to handle linting, automated
testing, concatenating and minifying of files.  The project is structured like
so:

* `lib` - project javascript files
* `vendor` - project required libraries
* `dist` - location of concatenated and minified files
* `test` - automated tests

Installation
------------

Make sure node.js and NPM are installed first, then run the following commands
from the project directory:

```
npm install -g grunt
npm install
```

Running a server with file watching
-----------------------------------

The command `grunt` will create a server running at
[http://localhost:8000](http://localhost:8000), and will watch for file changes
and automatically lint, test, and concatenate a new file on any change.

Building a production version of the javascript
-----------------------------------------------

The command `grunt concat min` will concatenate, then minify the latest source.
