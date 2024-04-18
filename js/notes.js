//172402512
function assert (condition, message) {
	if (condition) {
		return true;
	} 
	let E = new Error("Assertion failed: " + message); 
	throw E
	return E;
}
function argumentCheck (condition, message) {
	if (!condition) {
		let E = new TypeError("Invalid argument: " + message); 
		throw E
		return E; 
	}
}
//This file defines Note class and its subclasses, and provides an interface for saving and retrieving Notes
//ARGS = ["title", "content", "id", "dateCreated", "dateModified", "type"];
class Note {
	#type;
	#id;
	#dateCreated;
	#dateModified;
	//Note: This constructor is not intended for external use; only this class's factory methods should use it
	constructor (title = "", content, id, dateCreated, dateModified, type) {
		this.#id = id ?? crypto.randomUUID();//unique identifier to differentiate Note instances
		this.title = String(title);//String
		this.content = content;//Any; subclasses may require a specific type
		const now = Date.now();
		this.#dateCreated = new Date(dateCreated).valueOf() || now;//Number : Unix timestamp
		this.#dateModified = new Date(dateModified).valueOf() || now;//Number : Unix timestamp
		this.#type = NOTE_TYPE_NAMES.includes(type) ? type : NOTE_TYPE_NAMES[0];//String : enum NOTE_TYPE_NAMES
	}
	toString (verbose = false) {
		let obj = verbose === true ? {
			"type": this.#type,
			"id": this.#id,
			"title": this.title,
			"content": this.content, 
			"dateCreated": this.#dateCreated, 
			"dateModified": this.#dateModified
		} :
		{
			"title": this.title,
			"content": this.content, 
		};
		return JSON.stringify(obj);
	}
	static newNote (title = "", content, type) {
		return new this(title, content, Math.floor(Math.random() * 2**32).toString(16).padStart("0"), Date.now(), Date.now(), type);
	}
	static fromDictionary (obj) {
		//choose from obj the applicable keys for the Note constructor
		let currentArgs = [];
		["title", "content", "id", "dateCreated", "dateModified", "type"].forEach(a => currentArgs.push(obj[a]));
		return new this(...currentArgs);
	}
	get id () { return this.#id; }
	get dateCreated () { return Number(this.#dateCreated); }
	get dateModified () { return Number(this.#dateModified); }
}
class TextNote extends Note {
	constructor (title, content, id, dateCreated, dateModified) {
		super(title, content, id, dateCreated, dateModified, NOTE_TYPE_NAMES[0]);
	}
}
class ChecklistNote extends Note {
	//This constructor's content argument must be an Array of Objects {"text": String, "checked": Boolean}
	constructor(title, content, id, dateCreated, dateModified) {
		argumentCheck(typeof title === "string", "title argument to ChecklistNote constructor must be a string literal");
		argumentCheck(Array.isArray(content) && content.every(function (x) {return  "text" in x && typeof x.text === "string" && "checked" in x && (x.checked === "true" || x.checked === "false")}), "content argument to ChecklistNote constructor must be an array of objects of the form \n{\"text\": <i>String</i>, \"checked\": \"true\"/\"false\"}");
		super(title, content, id, dateCreated, dateModified, NOTE_TYPE_NAMES[1]);
	}
}
const NOTE_TYPES = [
	{
		"name": "Text",
		"class": TextNote,
		"contentType": String,
	},
	{
		"name": "Checklist",
		"class": ChecklistNote,
		"contentType": Array,
	},
];
const NOTE_TYPE_NAMES = NOTE_TYPES.map(x => x.name);
const Notes = {}
//methods to interface with the browser to get and push notes
Notes.getAll = function () {
	let noteList_str = localStorage.getItem("MJNotepad_Notes_NoteList") ?? "[]";
	let noteList = JSON.parse(noteList_str);
	//noteList must be an Array of Object (NoteDictionary)
	/*if (typeof noteList[0] === "string") {
		noteList[0] = JSON.parse(noteList[0]);
	}*/
	return noteList;
}
Notes.getById = function (id) {
	let noteList = Notes.getAll();
	for (let note of noteList) {
		if (note.id == id) {
			return note;
		}
	}
	return null;
}
Notes.update = function (argument) {
	//prepare note object for insertion
	if (argument instanceof Note) {
		argument = JSON.parse(argument.toString(true)); //convert Note argument to NoteDictionary
	}
	else if (["title", "content", "id", "dateCreated", "dateModified", "type"].every(k => k in argument)) {
		//assume that argument conforms to NoteDictionary schema
	}
	else {
		assert(argument instanceof Note || ["title", "content", "id", "dateCreated", "dateModified", "type"].every(function (k) {return k in argument}), "argument must be either an instance of Note or its subclasses, or an object with all of the following properties: [title, content, id, dateCreated, dateModified, type]");
		//It should be impossible for a user to pass an argument which isn't a Note or NoteDictionary during normal execution
	}
	let noteList = Notes.getAll();
	let noteExists = false;
	for (let i = 0; i < noteList.length; i++) {
		if (noteList[i].id == argument.id) {
			noteExists = true;
			noteList[i] = argument;
			break;
		}
	}
	//console.debug({"noteList": JSON.stringify(noteList), "noteExists": noteExists, "argumentT": argument, "argument": JSON.stringify(argument)})
	if (!noteExists) {
		noteList.push(argument);
	}
	localStorage.setItem("MJNotepad_Notes_NoteList", JSON.stringify(noteList).replaceAll("\\",""));
}
Notes.debugClear = function () {
	localStorage.setItem("MJNotepad_Notes_NoteList", "[]");
}
Notes.debugPopulate = function () {
	localStorage.setItem("MJNotepad_Notes_NoteList", "[]");
	for (let i = 0; i < 8; i++) {
		let textType = Math.random() > 0.5;
		Notes.update(textType ? 
			TextNote.newNote(
				["TNote", i+1, Math.floor(Math.random() * 10)].join(" "),
				"Content " + Math.floor(Math.random() * 4096)) : 
			ChecklistNote.newNote(
				["CNote", i+1, Math.floor(Math.random() * 10)].join(" "),
				Array( Math.floor(Math.random() * 4 + 4) ).fill(undefined).map(function () {return {"text" : String(Math.random()), "checked": String(Math.random() > 0.5)} }) )
		);
	}
}

//impose read-only status on classes and objects
const classes = [Note, TextNote, ChecklistNote, NOTE_TYPES, NOTE_TYPE_NAMES, Notes];
for (let obj of classes) {
	Object.seal(obj);
}