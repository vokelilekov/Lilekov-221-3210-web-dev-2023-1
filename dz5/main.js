'use strict';

function Task(id, name, desc, status) {

    this.id = id;
    this.name = name;
    this.desc = desc;
    this.status = status;

    this.remove = function () {
        localStorage.removeItem(`task-${this.id}`);
        if (this.element) {
            this.element.remove();
        }
    }

    this.createTaskElement = function () {
        let template = document.getElementById('task-template');
        let newTaskElement = template.content.firstElementChild.cloneNode(true);
        newTaskElement.id = this.id;
        newTaskElement.querySelector('.task-name').innerHTML = this.name;
        for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
            btn.onclick = moveBtnHandler;
        }
        return newTaskElement;
    }

    this.element = () => document.getElementById(id) || this.createTaskElement();

    this.updateTaskElement = function () {
        this.element.querySelector('.task-name').textContent = this.name;
        this.element.querySelector('.task-description').textContent = this.desc;
    }

    this.addElementToDocument = function () {
        let listElement = document.getElementById(`${this.status}-list`);
        listElement.append(this.element());
    }

}

function TaskManager() {
    this.serverUrl = "http://tasks-api.std-900.ist.mospolytech.ru/"
    this.apiKey = new URLSearchParams({ "api_key": "50d2199a-42dc-447d-81ed-d68a443b697e" })

    this.maxId = 0;

    this.createTask = async function (name, desc, status) {
        let task = new Task(this.maxId++, name, desc, status);
        let formData = new FormData();
        formData.set("name", task.name)
        formData.set("desc", task.desc)
        formData.set("status", task.status)
        try {
            let response = await fetch(this.serverUrl + "api/tasks?" + this.apiKey, {
                method: "POST",
                body: formData,
            })
            if (!response.ok) {
                showAlert(response.text(), "warning")
                return;
            }


            let data = await response.json();
            if (data["error"] !== undefined) {
                showAlert(data["error"], "warning")
                return;
            }

            task.addElementToDocument();
            this.maxId++;
            return task;
        } catch (error) {
            showAlert(error, "warning")
        }
    }

    this.getAllTasks = async function () {
        let res = [];
        let maxId = 0;
        try {
            let response = await fetch(this.serverUrl + "api/tasks?" + this.apiKey)
            if (!response.ok) {
                showAlert(response.error, "warning")
            }
            else {
                let data = (await response.json())["tasks"];
                for (let item of data) {
                    let task = new Task(item.id, item.name, item.desc, item.status)
                    res.push(task);
                    maxId = Math.max(maxId, task.id);
                }
                this.maxId = maxId + 1;
            }
        } catch (error) {
            showAlert(error, "warning")
        }

        return res;
    }

    this.getTaskById = async function (id) {
        try {
            let response = await fetch(this.serverUrl + `api/tasks/${id}?` + this.apiKey)

            if (!response.ok) {
                showAlert(response.error, "warning")
            }
            else {
                let data = await response.json();
                let task = new Task(data.id, data.name, data.desc, data.status)
                task.addElementToDocument();
                this.maxId = Math.max(this.maxId, task.id);
                return task;
            }
        } catch (error) {
            showAlert(error, "warning")
        }
    }

    this.deleteTask = async function (id) {
        try {
            let task = await this.getTaskById(id)
            if (task === undefined) {
                return;
            }
            if (task.element()) {
                task.element().remove()
            }

            let response = await fetch(this.serverUrl + `api/tasks/${id}?` + this.apiKey, {
                method: "DELETE"
            })

            if (!response.ok) {
                showAlert(response.error, "warning")
                return
            }
            return true
        } catch (error) {
            showAlert(error, "warning")
        }
    }

    this.editTask = async function ({ name, desc, status, task } = {}) {
        try {
            let changes = new FormData();
            if (name !== undefined && task.name != name) {
                changes.set("name", name)
            }
            if (desc !== undefined && task.desc != desc) {
                changes.set("desc", desc)
            }
            if (status !== undefined && task.status != status) {
                changes.set("status", status);
            }

            let response = await fetch(this.serverUrl + `api/tasks/${task.id}?` + this.apiKey, {
                method: "PUT",
                body: changes
            })

            if (!response.ok) {
                showAlert(response.error, "warning")
                return;
            }

            let editedTask = await response.json();
            let currentTask = document.getElementById(task.id);
            currentTask.querySelector('.task-name').innerHTML = editedTask["name"];

            return true;
        } catch (error) {
            showAlert(error, "warning")
        }

        return true;
    }
}

async function moveBtnHandler(event) {
    let taskElement = event.target.closest('.task');

    let task = await taskManager.getTaskById(taskElement.id);

    if (task === undefined) {
        return
    }

    let newStatus = task.status == 'to-do' ? 'done' : 'to-do'

    let newTask = await taskManager.editTask({ status: newStatus, task: task })

    if (newTask !== undefined) {
        let targetContainer = document.getElementById(`${newStatus}-list`);
        targetContainer.append(taskElement);
    }
}

function deleteTaskBtnHandler(event) {
    let form = event.target.closest('.modal').querySelector('form');
    let task = taskManager.deleteTask(form.elements['task-id'].value);
    task.remove();
}

function resetForm(form) {
    form.reset();
    form.querySelector('select').closest('.mb-3').classList.remove('d-none');
    form.elements['name'].classList.remove('form-control-plaintext');
    form.elements['description'].classList.remove('form-control-plaintext');
}

function setFormValues(form, task) {
    form.elements['name'].value = task.name
    form.elements['description'].value = task.desc;
    form.elements['task-id'].value = task.id;
}

function showAlert(msg, category = 'success') {
    let alerts = document.querySelector('.alerts');
    let template = document.getElementById('alert-template');
    let newAlert = template.content.firstElementChild.cloneNode(true);
    newAlert.querySelector('.msg').innerHTML = msg;
    newAlert.classList.add(`alert-${category}`)
    alerts.append(newAlert);
}

function updateTasksCounters(event) {
    let columnElement = event.target.closest('.card');
    let tasksCounterElement = columnElement.querySelector('.tasks-counter');

    tasksCounterElement.innerHTML = columnElement.querySelector('ul').children.length;
}

async function actionTaskBtnHandler(event) {
    let alertMsg, form, action, name, desc, status, task, taskId;

    form = this.closest('.modal').querySelector('form');
    action = form.elements['action'].value;
    name = form.elements['name'].value;
    desc = form.elements['description'].value;
    status = form.elements['column'].value;
    taskId = form.elements['task-id'].value;

    if (action == 'create') {
        task = await taskManager.createTask(name, desc, status);
        if (task !== undefined) {
            alertMsg = `Задача ${task.name} была успешно создана!`;
        }
    } else if (action == 'edit') {
        task = await taskManager.getTaskById(taskId);
        await taskManager.editTask({ name: name, desc: desc, task: task })
        alertMsg = `Задача ${name} была успешно обновлена!`;
    }

    if (alertMsg) {
        showAlert(alertMsg, 'success');
    }

    form.reset();
    form.elements['column'].classList.remove('d-none');
}

let titles = {
    'create': 'Создание новой задачи',
    'edit': 'Редактирование задачи',
    'show': 'Просмотр задачи'
};

let actionBtnText = {
    'create': 'Создать',
    'edit': 'Сохранить',
    'show': 'Ок'
};

let taskManager = new TaskManager();

window.onload = async function () {
    for (let list of document.querySelectorAll('#done-list, #to-do-list')) {
        list.addEventListener('DOMSubtreeModified', updateTasksCounters);
    }

    let tasks = await taskManager.getAllTasks();
    for (let task of tasks) {
        task.addElementToDocument();
    };

    document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;

    for (let btn of document.querySelectorAll('.move-btn')) {
        btn.onclick = moveBtnHandler;
    }

    document.getElementById('task-modal').addEventListener('show.bs.modal', async function (event) {
        let form = this.querySelector('form');
        resetForm(form)

        let action = event.relatedTarget.dataset.action || 'create';

        form.elements['action'].value = action;
        this.querySelector('.modal-title').textContent = titles[action];
        this.querySelector('.action-task-btn').textContent = actionBtnText[action];

        if (action == 'edit' || action == 'show') {
            let task = await taskManager.getTaskById(event.relatedTarget.closest('.task').id);
            setFormValues(form, task);
            this.querySelector('select').closest('.mb-3').classList.add('d-none');
        }

        if (action == 'show') {
            form.elements['name'].classList.add('form-control-plaintext');
            form.elements['description'].classList.add('form-control-plaintext');
        }

    });

    document.getElementById('remove-task-modal').addEventListener('show.bs.modal', async function (event) {
        let task = await taskManager.getTaskById(event.relatedTarget.closest('.task').id);
        let form = this.querySelector('form');
        form.elements['task-id'].value = task.id;
        this.querySelector('.task-name').textContent = task.name;
    });

    document.querySelector('.delete-task-btn').onclick = deleteTaskBtnHandler;

}