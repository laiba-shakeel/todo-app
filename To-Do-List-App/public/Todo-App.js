import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD2OV50iUCen7iJAi7o8oVWD_OQ6hjCzJs",
  authDomain: "to-do-app-16e5f.firebaseapp.com",
  databaseURL: "https://to-do-app-16e5f-default-rtdb.firebaseio.com",
  projectId: "to-do-app-16e5f",
  storageBucket: "to-do-app-16e5f.appspot.com",
  messagingSenderId: "143806954790",
  appId: "1:143806954790:web:a411337a5bc91a371ed5e7",
  measurementId: "G-7R5QRX1B09",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function writeData(text) {
  set(ref(db, "tasks/" + Date.now()), {
    text,
  });
}

function deleteData(key) {
  console.log(key);
  const updates = {};
  updates["tasks/" + key] = null;
  update(ref(db), updates);
}

function updateData(key, text) {
  const updates = {};
  updates["tasks/" + key + "/text/"] = text;
  update(ref(db), updates);
}

function CreateTaskElement(task, list_el, key = Date.now()) {
  const task_el = document.createElement("div");
  task_el.classList.add("task");
  task_el.id = key;
  const task_content_el = document.createElement("div");
  task_content_el.classList.add("content");

  task_el.appendChild(task_content_el);

  const task_input_el = document.createElement("input");
  task_input_el.classList.add("text");
  task_input_el.type = "text";
  task_input_el.value = task;
  task_input_el.setAttribute("readonly", "readonly");

  task_content_el.appendChild(task_input_el);

  const task_action_el = document.createElement("div");
  task_action_el.classList.add("actions");

  const task_edit_el = document.createElement("button");
  task_edit_el.classList.add("edit");
  task_edit_el.innerHTML = "Edit";

  const task_delete_el = document.createElement("button");
  task_delete_el.classList.add("delete");
  task_delete_el.innerHTML = "Delete";

  task_action_el.appendChild(task_edit_el);
  task_action_el.appendChild(task_delete_el);

  task_el.appendChild(task_action_el);

  list_el.appendChild(task_el);

  task_edit_el.addEventListener("click", () => {
    if (task_edit_el.innerText.toLowerCase() == "edit") {
      task_input_el.removeAttribute("readonly");
      task_input_el.focus();
      task_edit_el.innerHTML = "Save";
    } else {
      task_input_el.setAttribute("readonly", "readonly");
      task_edit_el.innerHTML = "Edit";
      updateData(task_el.id, task_input_el.value);
    }
  });
  task_delete_el.addEventListener("click", () => {
    deleteData(task_el.id);
    list_el.removeChild(task_el);
  });
}

function readData(list_el) {
  const tasksRef = ref(db, "tasks/");
  onValue(tasksRef, (snapshot) => {
    const tasks = snapshot.val();
    if (tasks) {
      const keys = Object.keys(tasks);
      list_el.innerHTML = "";
      keys?.map((key) => {
        CreateTaskElement(tasks[key].text, list_el, key);
      });
    }
  });
}

window.addEventListener("load", () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#task");

  readData(list_el);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = input.value;

    if (!task) {
      alert("please fill out the task");
      return;
    }

    CreateTaskElement(task, list_el);
    writeData(task);
    input.value = "";
  });
});
