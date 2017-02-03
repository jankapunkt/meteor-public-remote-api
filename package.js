Package.describe({
  name: 'jkuester:public-api',
  version: '0.0.5',
  // Brief, one-line summary of the package.
  summary: 'Helps to expose methods, subs and collections using a public json file.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jankapunkt/meteor-public-remote-api.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');
  api.mainModule('public-api.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jkuester:public-api','server');
  api.mainModule('public-api-tests.js');
});