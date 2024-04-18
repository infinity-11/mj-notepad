//172402512
window.addEventListener("load", function() {
	//get saved notes from localStorage
	let notesList = Notes.getAll();
	//create list items for notes
	if (notesList.length > 0) {
		document.querySelector("div#note-container > label").setAttribute("hidden", "indeed");
		for (let i = 0; i < notesList.length; i++) {
			let note = /*Note.fromDictionary*/(notesList[i]);
			let noteItemDiv = document.createElement("div");
			noteItemDiv.innerHTML = `<div id="note-list-item-${i}" class="note-list-item">
				<span class="note-list-item-title">${note.title}</span>
				<span style="flex-grow: 1; justify-self: right; text-align: right;">
					<span>${dayjs(note.dateModified).format("HH:mm, DD MMM")}</span>
				</span>
			</div>`;
			document.getElementById("note-container").appendChild(noteItemDiv);
		}
	}
	//add feature (go to editor) to each list item
	document.querySelectorAll("*.note-list-item").forEach(function (element) {
		element.addEventListener("click", function () {
			let noteObject = Notes.getAll()[element.id.match("[0-9]+$")[0]]
			noteObject["mode"] = "edit";
			console.debug(noteObject);
			Intent.putExtra("noteObject", noteObject, "./editor.html");
		})
	});
	document.getElementById("new-note").addEventListener("click", function () {
		Intent.putExtra("noteObject", {"mode": "create", "type": "Text"}, "./editor.html")
	});
})