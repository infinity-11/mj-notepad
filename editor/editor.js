//172402512
function debug_generateText() {
	const CHARS = Array(36).fill().map((x, i)=>String.fromCharCode(i + (i < 10 ? 48 : 55)));
	let str = Array(Math.floor(Math.random() * 256)).fill().map(()=>CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
	document.getElementById("text-note-textarea").value = str.slice(0, 6 < str.length ? 6 : str.length);
	document.getElementById("text-note-textarea").value = str;
}
function hideEditors (activeType) {
	const CHECKLIST = document.getElementById("checklist-div");
	const TEXTAREA = document.getElementById("text-note-textarea");
	//Hide irrelevant editing elements
	switch (activeType) {
		case NOTE_TYPE_NAMES[0]:
			TEXTAREA.style.display = "initial";
			CHECKLIST.style.display = "none";
			break;
		case NOTE_TYPE_NAMES[1]:
			TEXTAREA.style.display = "none";
			CHECKLIST.style.display = "initial";
			break;
		default:
			TEXTAREA.style.display = "none";
			CHECKLIST.style.display = "none";
	}
}
function saveNote(title, content, type) {
	let noteList = Notes.getAll();
	if (Intent.getExtra("noteObject").mode == "create") {
		Notes.update(Note.newNote(title, content, type));
	}
	else if (Intent.getExtra("noteObject").mode = "edit") {
		console.debug(noteList)
		let data = {
			"type": Intent.getExtra("noteObject").type,
			"id": Intent.getExtra("noteObject").id,
			"title": title,
			"content": content,
			"dateCreated": Intent.getExtra("noteObject").dateCreated,
			"dateModified": Date.now().toString(),
		}
		Notes.editExisting(data);
	}
	if (window.confirm("Your note has been saved.\nWould you like to return to the main page?", "Yes", "No")) {
		location.replace("./index.html");
	}
}
function newChecklistItem (text, checked) {
	let checklistItem = document.createElement("div");
	checklistItem.setAttribute("class", "checklist-item");
	let checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("class", "checklist-item-checkbox");
	if (checked) {checkbox.setAttribute("checked", checked); checkbox.checked = checked}
	checklistItem.appendChild(checkbox);
	let itemText = document.createElement("input");
	itemText.setAttribute("type", "text");
	itemText.setAttribute("class", "checklist-item-text");
	itemText.setAttribute("placeholder", "Task or item");
	if (text) {itemText.setAttribute("value", String(text))}
	itemText.setAttribute("value", Math.floor( Math.random() * 2**10 ).toString() )
	checklistItem.appendChild(itemText);
	let removeButton = document.createElement("button");
	removeButton.innerHTML = "&#8861";
	removeButton.setAttribute("class", "checklist-item-remove-button");
	removeButton.addEventListener("click", function (event) {
		let element = event.target;
		element.parentElement.parentElement.removeChild(element.parentElement);
	});
	checklistItem.appendChild(removeButton);
	document.getElementById("checklist-div").appendChild(checklistItem);
}
window.addEventListener("load", function() {
	//housekeeping tasks
	const TITLE = document.getElementById("title-input");
	const TEXTAREA = document.getElementById("text-note-textarea");
	const TYPE_SELECT = document.getElementById("type-select");
	const CHECKLIST = document.getElementById("checklist-div");
	let extra = Intent.getExtra("noteObject");
	if (extra.mode == "edit") {
		//disable type-select if user is editing an existing note
		TITLE.value = extra.title;
		TEXTAREA.value = extra.content;
		TYPE_SELECT.innerHTML = extra.type;
		TYPE_SELECT.setAttribute("inert", "true");
		TYPE_SELECT.setAttribute("class", "disabled");
		//Load content from extra
		if (extra.type == NOTE_TYPE_NAMES[1]) {
			for(let item of extra.content) {
				newChecklistItem(item.text, item.checked === "true" ? true : false);
			}
		}
	}
	//Hide irrelevant editing elements
	hideEditors(extra.type);
	//add type-select feature (switch between note types)
	TYPE_SELECT.addEventListener("click", function () {
		if (TYPE_SELECT.getAttribute("inert") != "true") {
			TYPE_SELECT.innerHTML = NOTE_TYPE_NAMES[(NOTE_TYPE_NAMES.indexOf(TYPE_SELECT.innerHTML) + 1) % NOTE_TYPES.length];
			hideEditors(TYPE_SELECT.innerHTML);
		}
	});
	//add checklist feature
	document.getElementById("add-checklist-item").addEventListener("click", function () {
		/*the code below this comment adds a new checklist item to the list, and is equivalent to:
		CHECKLIST.innerHTML += `<div id="checklist-item-${CHECKLIST.children.length - 1}" class="checklist-item">
			<input type="checkbox"></input><input type="text" style="width: 90%; margin-left: 1%;" placeholder="Task or item"></input>
			<button class="checklist-item-remove-button" id="checklist-item-remove-${CHECKLIST.children.length - 1}">&#8861;</button>
		</div>`*/
		newChecklistItem(undefined, undefined);
	});
	//add save-button feature (save notes to localStorage)
	document.getElementById("save-button").addEventListener("click", function() {
		let title = TITLE.value;
		let type = TYPE_SELECT.innerHTML;
		let content;
		if (type == NOTE_TYPE_NAMES[0]) {
			content = TEXTAREA.value;
		}
		else if (type == NOTE_TYPE_NAMES[1]) {
			let tempContent = Array();
			document.querySelectorAll("#checklist-div > *.checklist-item").forEach(function (element) {
				tempContent.push({"text": element.children[1].value, "checked": element.children[0].checked});
			});
			content = tempContent;
		}
		saveNote(title, content, type);
	});
});
//Mateo J.