import {check} from 'meteor/check';
const fs = require('fs');

/**
 * Public API exposure class. Keeps track of your public meteor methods, publications and collections, which may be
 * consumed by other apps/services via DDP.
 */
class PApi {

    /**
     * @constructor constructor of the class
     */
    constructor() {
        this.api = {};
        this.flushData();
    }

    /**
     *
     * @param obj The data object which is used to inject the values. Use {@link PApi#flushData} and {@link PApi#getData}
     * to see the initial structure.
     * @returns {PApi} itself for chaining.
     */
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

    /**
     * Returns the underlying data structure.
     * @returns {{name: string, description: string, urls: {}, methods: {}, publications: {}, collections: {}}|*|{}}
     */
    getData() {
        return this.api;
    }

    /**
     * Flushes the data structure to an initial state.
     * @returns {PApi}  itself for chaining.
     */
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

    /**
     * Adds an url to the list. Use multiple for indicating a cluster.
     * @param name Identifier of the application instance e.g. default for your main url
     * @param url the full qualified url
     * @returns {PApi}  itself for chaining.
     */
    addUrl(name, url) {
        check(name, String);
        check(url, String);
        this.api.urls[name] = url;
        return this;
    }

    /**
     * Returns the url by a given identifier.
     * @param name Name of the application behind the url
     * @returns {string} Full qualified url.
     */
    getUrl(name) {
        check(name, String);
        return this.api.urls[name];
    }

    /**
     * Sets the name of this application as you want it to be seen by the public.
     * @param name The name
     * @returns {PApi} itself for chaining.
     */
    setName(name) {
        check(name, String);
        this.api.name = name;
        return this;
    }

    /**
     * Gets the name of this application as you want it to be seen by the public.
     * @returns {string}
     */
    getName() {
        return this.api.name;
    }

    /**
     * Describe your application for the public.
     * @param description A brief (or full) description.
     * @returns {PApi} itself for chaining.
     */
    setDescription(description) {
        check(description, String);
        this.api.description = description;
        return this;
    }

    /**
     * Gets the description for the public.
     * @returns {string} The description.
     */
    getDescription(){
        return this.api.description;
    }

    /**
     * Exposes a method (name only) for the public. Use the description to indicate which parameters are used.
     * @param name Name of your method, as it has been added by {@link Meteor#methods}
     * @param description Description of the behavior and usage of the method
     * @returns {PApi} itself for chaining.
     */
    addMethod(name, description) {
        check(name, String);
        check(description, String);
        this.api.methods[name] = description;
        return this;
    }

    /**
     * Returns a description of a method (and indicates that the method is registered) by its name.
     * @param name The name of the added method.
     * @returns {string} The description of the method.
     */
    getMethod(name) {
        check(name, String);
        return this.api.methods[name];
    }

    /**
     * Exposes a publication (name only) for the public. Use the description to indicate which parameters are used.
     * @param name Name of your publication, as it has been added by {@link Meteor#publish}
     * @param description Description of the behavior and usage of the method
     * @returns {PApi} itself for chaining.
     */
    addPublication(name, description) {
        check(name, String);
        check(description, String);
        this.api.publications[name] = description;
        return this;
    }

    /**
     * Returns a description of a publication (and indicates that the method is registered) by its name.
     * @param name The name of the added publication.
     * @returns {string} The description of the Publication.
     */
    getPublication(name) {
        check(name, String);
        return this.api.publications[name];
    }

    /**
     * Exposes a collection (name only) for the public. Use the description to indicate which parameters are used.
     * @param name Name of your collection, as it has been added by Mongo.collection(collectioName)
     * @param description Description of the behavior and usage of the collection
     * @returns {PApi} itself for chaining.
     */
    addCollection(name, description) {
        check(name, String);
        check(description, String);
        this.api.collections[name] = description;
        return this;
    }

    /**
     * Returns a description of a collection (and indicates that the collection is registered) by its name.
     * @param name The name of the added collection.
     * @returns {string} The description of the collection.
     */
    getCollection(name) {
        check(name, String);
        return this.api.collections[name];
    }

    /**
     * Writes the api data structure to a JSON file by a given path.
     * @param fileName Name of your file e.g. api.json
     * @param path Path to your public folder
     * @param subPath Path inside your public folder to the file
     * @param asyncCallback Add your callback to use async, if null it will be written
     */
    publish(fileName = "api.json", path = "", subPath = "", asyncCallback) {
        if (!this.BASE_DIR) {
			console.log(process.env);
			if (String(process.env.OS).toLowerCase().indexOf("windows")>-1)
				this.BASE_DIR = process.cwd().replace(/\\/g, "/");
			else
				this.BASE_DIR = process.env.PWD;
        }
		
		const targetPath = this.BASE_DIR + "/" + path + "public/" + subPath;
		const pathSplit = targetPath.split("/");
		let tmp="";
		for (let part of pathSplit) {
			tmp+=part+"/";
			if (!fs.existsSync(tmp))
				fs.mkdirSync(tmp); 
		}
		
        const file = JSON.stringify(this.api);
        //console.logError("received file " );
        if (!file || !fileName) {
            throw new Meteor.Error("could not write to file");
            console.log(e.stack);
        }

        if (asyncCallback) {
            fs.writeFile(targetPath + fileName, file, 'utf8', asyncCallback);
        }else{
            fs.writeFileSync(targetPath + fileName, file, 'utf8');
        }
    }
}

export const PublicAPI = new PApi();