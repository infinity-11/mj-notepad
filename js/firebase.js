window.addEventListener("load", function () {
	Firebase.storage.functions = new Object();
	Firebase.auth.functions = new Object();
	// unpack Firebase.storage primitives
	const storage = Firebase.storage;
	const ref = Firebase.storage.primitives.ref;
	const uploadBytes = Firebase.storage.primitives.uploadBytes;
	const uploadBytesResumable = Firebase.storage.primitives.uploadBytesResumable;
	const getDownloadURL = Firebase.storage.primitives.getDownloadURL;
	const deleteObject = Firebase.storage.primitives.deleteObject;
	const updateMetadata = Firebase.storage.primitives.updateMetadata;
	const getMetadata = Firebase.storage.primitives.getMetadata;
	const list = Firebase.storage.primitives.list;
	const listAll = Firebase.storage.primitives.listAll;
	
	Firebase.storage.functions.quickRef = function quickRef(path) {
		return ref(storage, path);
	}
	Firebase.storage.functions.listAll = function (rootPath) {
		const reference = ref(storage, rootPath);
		let response;
		listAll(reference).then(function(x){response = x});
		return response;
	}
	Firebase.storage.functions.writeTest = async function writeTestImage() {
		let response = await fetch("js/index.png");
		let blob = await response.blob();
		let testCloudRef = ref(storage, "test/images/index.png");
		let uploadResult = uploadBytes(testCloudRef, blob).then(function (snapshot) {
			return snapshot;
		});
	}
	Firebase.storage.functions.write = function (blob, location, metadata) {
		const reference = ref(storage, location);
		const uploadResult = uploadBytes(reference, blob, metadata);
		return uploadResult;
	}
	Firebase.storage.functions.writeLarge = function (blob, location, metadata) {
		const reference = ref(storage, location);
		const uploadTask = uploadBytesResumable(reference, blob, metadata);
		return uploadTask;
	}
	Firebase.storage.functions.metadata = {
		"get": async function (path) {
			const reference = ref(storage, path);
			let metadata;
			getMetadata(reference).then(function(x){metadata = x});
			return metadata;
		},
		"set": async function (path, metadata) {
			const reference = ref(storage, path);
			let newMetadata;
			updateMetadata(reference, metadata).then(function(x){newMetadata = x});
			return newMetadata
		},
		"setCustom": function (path, metadata) {
			const reference = ref(storage, path);
			let newMetadata;
			updateMetadata(reference, {"customMetadata": metadata}).then(function(x){newMetadata = x});
			return newMetadata;
		}
	};
	Firebase.storage.functions.delete = function (path) {
		return deleteObject(ref(storage, path)) || "Success.";
	}
	Firebase.storage.functions.flush = function (folderPath) {
		const reference = ref(storage, folderPath);
		listAll(reference).then( function (response) {
			for (const file of response.items) {
				deleteObject(file);
			}
		})
		return true;
	}
	Firebase.storage.functions.URL = function (path) {
		return getDownloadURL(ref(path));
	}
	Firebase.auth.functions.signInEmail = function signIn (email, password) {
		return Firebase.auth.primitives.signInWithEmailAndPassword(Firebase.auth, email, password);
	}
	Firebase.auth.functions.sudo = function superUserLogin() {
		return Firebase.auth.primitives.signInWithEmailAndPassword(Firebase.auth, "viaticalpick1248@gmail.com", "SuperUser");
	}
	Firebase.auth.functions.createEmail = function createUser (email, password) {
		return Firebase.auth.primitives.createUserWithEmailAndPassword(Firebase.auth, email, password);
	}
	Firebase.auth.functions.googleRedirect = function signInWithRedirect () {
		return Firebase.auth.primitives.signInWithRedirect(Firebase.auth.provider);
	}
});