import {check} from 'meteor/check';
const fs = require('fs');

class PApi {
    constructor() {
        this.api = {};
        this.flushData();
    }

    setData(obj){
        console.log(obj);
        check(obj, {
            name:String,
            description: String,
            urls: Object,
            methods: Object,
            publications: Object,
            collections: Object
        });
        this.api = obj;
        return this;
    }

    getData() {
        return this.api;
    }

    flushData() {
        this.api = {
            name: "",
            description: "",
            urls: {},
            methods: {},
            publications: {},
            collections: {},
        };
        return this;
    }

    addUrl(name, url) {
        check(name, String);
        check(url, String);
        this.api.urls[name] = url;
    }

    getUrl(name) {
        check(name, String);
        return this.api.urls[name];
    }

    setName(name) {
        check(name, String);
        this.api.name = name;
    }

    getName() {
        return this.api.name;
    }

    setDescription(description) {
        check(description, String);
        this.api.description = description;
    }

    getDescription(){
        return this.api.description;
    }

    addMethod(name, description) {
        check(name, String);
        check(description, String);
        this.api.methods[name] = description;
    }

    getMethod(name) {
        check(name, String);
        return this.api.methods[name];
    }

    addPublication(name, description) {
        check(name, String);
        check(description, String);
        this.api.publications[name] = description;
    }

    getPublication(name) {
        check(name, String);
        return this.api.publications[name];
    }

    addCollection(name, description) {
        check(name, String);
        check(description, String);
        this.api.collections[name] = description;
    }

    getCollection(name) {
        check(name, String);
        return this.api.collections[name];
    }

    publish(fileName = "api.json", path = "", subPath = "", asyncCallback) {
        if (!this.BASE_DIR) {
            this.BASE_DIR = process.env.PWD;
        }
        const file = JSON.stringify(this.api);
        //console.logError("received file " );
        if (!file || !fileName) {
            throw new Meteor.Error("could not write to file");
            console.log(e.stack);
        }

        if (asyncCallback) {
            fs.writeFile(this.BASE_DIR + "/" + path + "public/" + subPath + fileName, file, 'utf8', asyncCallback);
        }else{
            return fs.writeFileSync(this.BASE_DIR + "/" + path + "public/" + subPath + fileName, file, 'utf8');
        }
    }
}

export const PublicAPI = new PApi();