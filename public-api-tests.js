// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by public-api.js.
import { PublicAPI } from "meteor/jkuester:public-api";

//NODE SERVER FILESYS
const fs = require('fs');

//----------------------------------------------------//

const NAME = "public-api-test-package"
const DESCRIPTION = "some public description";

const URL_DEFAULT = "http://localhost:3000";
const URL_FALLBACK = "http://localhost:3333";

const KEY_DEFAULT = "default";
const KEY_FALLBACK = "fallback";

const GET_ALL_DOCS =  "a method which returns a list of all methods";
const SOME_CALL = "some other methods";

const KEY_ALL_METHODS = "get_all_methods";
const KEY_SOME_CALL = "some_call";

const GET_ALL_DOCUMENTS = "gets all documents";
const SOME_OTHER_DOCUMENTS = "gets som other documents";

const KEY_ALL_DOCS = "get_all_docs";
const KEY_OTHER_DOCS = "get_other_docs";

const A_LOG_COLLECTION = "a log collection";
const A_DOG_COLLECTION = "a dog collection";

const KEY_LOGS ="logs";
const KEY_DOGS = "dogs";

//----------------------------------------------------//

Tinytest.add('public-api - is not null', function (test) {
    test.isNotNull(PublicAPI);
});


Tinytest.add('public-api - full expose', function (test) {

    const initial_data = PublicAPI.flushData().getData();

    //----------------------------------------------------//

    PublicAPI.setName(NAME);
    PublicAPI.setDescription(DESCRIPTION);

    //----------------------------------------------------//

    PublicAPI.addUrl(KEY_DEFAULT, URL_DEFAULT); //default app
    PublicAPI.addUrl(KEY_FALLBACK, URL_FALLBACK); //woa you use a cluster...

    //----------------------------------------------------//

    PublicAPI.addMethod(KEY_ALL_METHODS, GET_ALL_DOCS);
    PublicAPI.addMethod(KEY_SOME_CALL, SOME_CALL);

    //----------------------------------------------------//

    PublicAPI.addPublication(KEY_ALL_DOCS, GET_ALL_DOCUMENTS);
    PublicAPI.addPublication(KEY_OTHER_DOCS, SOME_OTHER_DOCUMENTS);

    //----------------------------------------------------//

    PublicAPI.addCollection(KEY_LOGS, A_LOG_COLLECTION);
    PublicAPI.addCollection(KEY_DOGS, A_DOG_COLLECTION);

    //----------------------------------------------------//

    testApi(test);

    //----------------------------------------------------//

    try {
        PublicAPI.publish("api.json", "public-api/", "");
    }catch(e) {
        console.log(e.message);
        console.log(e.stack);
        throw e;
    }

    //----------------------------------------------------//
	
	let baseDir;
	if (String(process.env.OS).toLowerCase().indexOf("windows")>-1)
				baseDir = process.cwd().replace(/\\/g, "/");
			else
				baseDir = process.env.PWD;
    const loadedJson = fs.readFileSync(baseDir + '/public-api/public/api.json').toString();
    testExists(test, loadedJson, "loadJson");

    const jsonObj = JSON.parse(loadedJson);
    testExists(test, jsonObj, "jsonObj");

    //----------------------------------------------------//

    PublicAPI.flushData().setData(jsonObj);
    testApi(test);
});


function testApi(test) {
    test.equal(PublicAPI.getName(), NAME);
    test.equal(PublicAPI.getDescription(), DESCRIPTION);

    test.equal(PublicAPI.getUrl(KEY_DEFAULT), URL_DEFAULT);
    test.equal(PublicAPI.getUrl(KEY_FALLBACK), URL_FALLBACK);

    test.equal(PublicAPI.getMethod(KEY_ALL_METHODS), GET_ALL_DOCS);
    test.equal(PublicAPI.getMethod(KEY_SOME_CALL), SOME_CALL);

    test.equal(PublicAPI.getPublication(KEY_ALL_DOCS), GET_ALL_DOCUMENTS);
    test.equal(PublicAPI.getPublication(KEY_OTHER_DOCS), SOME_OTHER_DOCUMENTS);

    test.equal(PublicAPI.getCollection(KEY_LOGS), A_LOG_COLLECTION);
    test.equal(PublicAPI.getCollection(KEY_DOGS), A_DOG_COLLECTION);
}



function testExists(test, obj, optionalName){
    if (!optionalName)
        optionalName = "";
    test.isNotNull(obj, "unexpected object is null ("+optionalName+")");
    test.isNotUndefined(obj, "unexpected: object is undefined ("+optionalName+")");
}

function testObjectHasChildren(test, obj, expectedChildCount){
    testExists(test, obj);
    const keys = Object.keys(obj);
    testExists(test, keys);
    test.equal(keys.length, expectedChildCount, "unexpected: childcount is " + keys.length+", expected is "+expectedChildCount);
}