function addNewNoteOnButtonClick() {
  document.getElementById('add-note').addEventListener('click', async () => {
    const noteTemplate = getNoteTemplate();
    const card = noteTemplate.querySelector('.card.item--note');
    card.addEventListener('click', (e) => {
      addEventListener2Note(e, card);
    });
    addEventListenerOnEditAndBlur2Note(card);
    const newNote = {title: ""};
    const createdNote = await createNewNote(newNote);
    card.dataset.noteid = createdNote._id;
    noteTemplate.querySelector('.item-body>h4').innerText = createdNote.title;
    noteTemplate.getElementById('date-created').innerText = convertDate(createdNote.date);
    document.querySelector('#board').appendChild(noteTemplate);
  })
}

function addNewListOnButtonClick() {
  document.getElementById('add-list').addEventListener('click', async () => {
    const listTemplate = getListTemplate();
    const card = listTemplate.querySelector('.card.item--list');
    card.addEventListener('click', (e) => {
      addEventListener2List(e, card);
    });
    addEventListenerOnEditAndBlur2List(card);
    const newList = {title: ""};
    const createdList = await createNewList(newList);
    card.dataset.listid = createdList._id;
    listTemplate.querySelector('.item-body>h4').innerText = createdList.title;
    listTemplate.getElementById('date-created').innerText = convertDate(createdList.date);
    document.querySelector('#board').appendChild(listTemplate);
  })
}

async function createNewNote(note) {
  return await makeRequest('POST', '/api/notes', note);
}

async function updateNote(note) {
  const titleNote = note.querySelector('.item-body h4').innerText;
  const textNote = note.querySelector('.item-body > p').innerText;
  const saveNote = {
    title: titleNote,
    text: textNote
  };
  const updatedNote = await makeRequest('PUT', `/api/notes/${note.dataset.noteid}`, saveNote);
  if (updatedNote.message) {
    alert(updatedNote.message);
  }
}

async function deleteNote(note) {
  const response = await makeRequest('DELETE', `/api/notes/${note.dataset.noteid}`);
  if (note.dataset.noteid === response._id) {
    note.remove();
  } else {
    alert(`Can't remove Note with id: ${note.dataset.noteid}`)
  }
}


async function createNewList(list) {
  return await makeRequest('POST', '/api/lists', list);
}

async function updateList(list) {
  const titleList = list.querySelector('.item-body h4').innerText;
  const saveList = {
    title: titleList,
    tasks: []
  };
  list.querySelectorAll('.task-wrapper').forEach((e) => {
    const tmpObj = {};
    e.classList.contains('checked') ? tmpObj.checked = 'checked' : tmpObj.checked = '';
    tmpObj.taskBody = e.querySelector('p[contenteditable]').innerText;
    tmpObj.taskId = e.getAttribute('data-taskid');
    saveList.tasks.push(tmpObj);
  });
  const updatedList = await makeRequest('PUT', `/api/lists/${list.dataset.listid}`, saveList);
  if (updatedList.message) {
    alert(updatedList.message);
  }
}

async function deleteList(list) {
  const response = await makeRequest('DELETE', `/api/lists/${list.dataset.listid}`);
  if (list.dataset.listid === response._id) {
    list.remove();
  } else {
    alert(`Can't remove List with id: ${list.dataset.listid}`)
  }
}

function addEventListenerOnEditAndBlur2Note(element) {
  element.addEventListener('focusout', (e) => {
    const note = e.target.closest(".card.item--note");
    if (note.dataset.changed === 'true') {
      updateNote(note);
      note.dataset.changed = 'false';
    }
  });
  element.addEventListener('input', (e) => {
    e.target.closest(".card.item--note").dataset.changed = 'true';
  });
  addEventListAndNoteOnFocus(element);
}

function addEventListenerOnEditAndBlur2Notes() {
  document.querySelectorAll(".item--note [contenteditable='true']").forEach((el) => {
    addEventListenerOnEditAndBlur2Note(el);
  })
}

function addEventListenerOnEditAndBlur2List(element) {
  element.addEventListener('click', (e) => {
    if (e.target.closest(".task-wrapper .check-mark")) {
      e.target.closest('.task-wrapper').classList.toggle('checked');
      updateList(e.target.closest(".card.item--list"));
    }
    if (e.target.closest(".delete-task")) {
      const deletedTask = e.target.closest(".card.item--list");
      e.target.closest('.task-wrapper').remove();
      updateList(deletedTask);
    }
    if (e.target.closest(".add-task")) {
      const newTask = getTaskTemplate();
      e.target.previousElementSibling.appendChild(newTask);

      updateList(e.target.closest(".card.item--list"));
    }
  });

  element.addEventListener('focusout', (e) => {
    if (e.target.closest(".item--list [contenteditable='true']")) {
      const list = e.target.closest(".card.item--list");
      if (list.dataset.changed === 'true') {
        updateList(list);
        list.dataset.changed = 'false';
      }
    }
  });

  element.addEventListener('input', (e) => {
    if (e.target.closest(".item--list [contenteditable='true']")) {
      e.target.closest(".card.item--list").dataset.changed = 'true';
    }
  });
  addEventListAndNoteOnFocus(element);
}

function addEventListenerOnEditAndBlur2Lists() {
  document.querySelectorAll(".card.item--list").forEach((el) => {
    addEventListenerOnEditAndBlur2List(el)
  });
}

const addEventListener2Note = (event, note) => {
  if (event.target.closest("[type='button'][data-action='delete']")) {
    deleteNote(note).then().catch(err => console.log(err));
  }
};

const addEventListener2List = (event, list) => {
  if (event.target.closest("[type='button'][data-action='delete']")) {
    deleteList(list).then().catch(err => console.log(err));
  }
};

const addEventListener2Notes = () => {
  const lists = document.querySelectorAll(".card.item--note");
  lists.forEach((n) => {
    n.addEventListener('click', (e) => {
      addEventListener2Note(e, n);
    })
  })
};

const addEventListener2Lists = () => {
  const lists = document.querySelectorAll(".card.item--list");
  lists.forEach((l) => {
    l.addEventListener('click', (e) => {
      addEventListener2List(e, l);
    })
  })
};

const addEventListener2AllCards = () => {
  addEventListener2Notes();
  addEventListener2Lists();

  addEventListenerOnEditAndBlur2Notes();
  addEventListenerOnEditAndBlur2Lists();

  addNewNoteOnButtonClick();
  addNewListOnButtonClick();

};

window.onload = addEventListener2AllCards;

function addEventListAndNoteOnFocus() {
  document.addEventListener('click', (e) => {
    if (e.target.closest(".card")) {
      if(document.querySelector(".card.focus-card")) {
        document.querySelector(".card.focus-card").classList.remove('focus-card');
        e.target.closest(".card").classList.add('focus-card');
        document.querySelector('.fader').classList.remove('none');
      }
      else {
        e.target.closest(".card").classList.add('focus-card');
        document.querySelector('.fader').classList.remove('none');
      }
    }
    else {
      if (document.querySelector(".card.focus-card")) {
        document.querySelector(".card.focus-card").classList.remove('focus-card');
        document.querySelector('.fader').classList.add('none');
      }
      else {
        document.querySelector('.fader').classList.add('none');
      }
    }
    console.log('для изменения эффектов "фокуса карт/листов - редактировать класс ".focus-card"! А я чет в css запутался, памагити(');
    if (e.target.closest('.btn-floating.btn-sm.deep-orange')){
      document.querySelector('.fader').classList.add('none');
    }
  })
}

// Utils
async function makeRequest(method, url, data) {
  document.getElementById('css-loader-all').classList.remove('none');
    const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, cors, *same-origin
    // cache: 'force-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrer: 'no-referrer' // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  }).catch(e => {console.log('Bad URL: ', e)});
  document.getElementById('css-loader-all').classList.add('none');
  return await response.json();
}

function getTemplate(id) {
  return document.getElementById(id).content.cloneNode(true);
}

function getNoteTemplate() {
  return getTemplate('noteTemplate');
}

function getListTemplate() {
  return getTemplate('listTemplate');
}

function getTaskTemplate() {
  return getTemplate('taskTemplate');
}

function convertDate(date) {
  return moment(date).locale('uk').format('ddd, Do MMM YYYY, HH:mm:ss');
}