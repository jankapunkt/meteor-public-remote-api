**Meteor Public API for Remote Collections, Methods and Publications**

Helps you to expose, what is public, while you code.
Just import the PublicApi class and add definitions directly when you define them.



***Usage***

```javascript

import { PublicAPI } from "meteor/jkuester:public-api";

PublicAPI.setName("MY-MICROSERVICE-NAME");
PublicAPI.setDescription("describe what your application/microservice does...")
```

In your app you declare a method the usual way

```javascript
const MY_PUBLIC_METHOD = "my_public_method";
Meteor.methods(MY_PUBLIC_METHOD, function(){ /* some code */ });
```

And then expose it to the api:

```javascript
PublicAPI.addMethod(MY_PUBLIC_METHOD, "description of what your method does....");
```

Same with collections

```javascript
const MY_COLLECTION_NAME = "myCollectionName";
export MyCollection = new Mongo.Collection(MY_COLLECTION_NAME);
PublicAPI.addCollection(MY_COLLECTION_NAME, "a simple collection without schema");
```

And the same with publlications...

```javascript
const PUBCIC_DATA_FROM_MY_COLLECTION = "publicDataFromMyCollectio";
Meteor.publish(PUBCIC_DATA_FROM_MY_COLLECTION, function(){ /* some code */ });
PublicAPI.addPublication(PUBCIC_DATA_FROM_MY_COLLECTION, "tells my collection: show me what you got");
```

At the end of all your definitions, you call

```javascript
PublicAPI.publish("api.json", "path/to/public/", "subpath/in/public"/*, optionalCallback */);
```

And in your public folder will be something like this:

```javascript
{
    "name": "public-api-test-package",
    "desription": "some public description",
    "urls": {
        "default": "http://localhost:3000",
        "fallback": "http://localhost:3333"
    },
    "methods": {
        "get_all_methods": "a method which returns a list of all methods",
        "some_call": "some other methods"
    },
    "publications": {
        "get_all_docs": "gets all documents",
        "get_other_docs": "gets som other documents"
    },
    "collections": {
        "logs": "a log collection",
        "dogs": "a dog collection"
    }
}
```

***LICENCE***


MIT, see licence file.