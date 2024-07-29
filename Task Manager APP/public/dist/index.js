"use strict";
(() => {
    var _a, _b;
    // Enum para as plataformas de notificação
    let NotificationPlataform;
    (function (NotificationPlataform) {
        NotificationPlataform["SMS"] = "SMS";
        NotificationPlataform["EMAIL"] = "EMAIL";
        NotificationPlataform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    })(NotificationPlataform || (NotificationPlataform = {}));
    // Enum para os modos de visualização (Todo ou Reminder)
    let ViewMode;
    (function (ViewMode) {
        ViewMode["TODO"] = "TODO";
        ViewMode["REMINDER"] = "REMINDER";
    })(ViewMode || (ViewMode = {}));
    // Função para gerar UUIDs únicos
    const UUID = () => {
        return Math.random().toString(32).substring(2, 9);
    };
    // Utilitários para manipulação de datas
    const DateUtils = {
        today() {
            return new Date();
        },
        tomorrow() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        formatDate(date) {
            return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        },
    };
    // Classe para tarefas de lembrete (Reminder)
    class Reminder {
        constructor(description, date, notifications) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = "";
            this.date = DateUtils.tomorrow();
            this.notifications = [NotificationPlataform.EMAIL];
            this.description = description;
            this.date = date;
            this.notifications = notifications;
        }
        // Atualiza uma tarefa de lembrete
        update(description, date, notifications) {
            this.description = description;
            this.date = date;
            this.notifications = notifications;
            this.dateUpdated = DateUtils.today();
        }
        // Renderiza uma representação da tarefa
        render() {
            return `
            ${this.description} | ${DateUtils.formatDate(this.date)} | ${this.notifications.join(",")}
            `;
        }
    }
    // Classe para tarefas de To-Do
    class Todo {
        constructor(description) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = "";
            this.done = false;
            this.description = description;
        }
        // Atualiza uma tarefa de To-Do
        update(description) {
            this.description = description;
            this.dateUpdated = DateUtils.today();
        }
        // Alterna o estado de conclusão da tarefa
        toggleDone() {
            this.done = !this.done;
            this.dateUpdated = DateUtils.today();
        }
        // Renderiza uma representação da tarefa
        render() {
            return `
            ${this.description} | ${this.done ? "Yes" : "No"}
            `;
        }
    }
    // Objeto para manipulação da visualização de tarefas
    const taskView = {
        // Cria uma nova tarefa de To-Do a partir do formulário
        getTodo(form) {
            const todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        // Cria uma nova tarefa de lembrete a partir do formulário
        getReminder(form) {
            const reminderNotifications = [
                form.notification.value,
            ];
            const reminderDate = new Date(form.scheduleDate.value);
            const reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        // Renderiza a lista de tarefas com base no modo (To-Do ou Reminder)
        render(tasks, mode) {
            const todoList = document.getElementById("todoList");
            const reminderList = document.getElementById("reminderList");
            // Limpa as listas de tarefas existentes
            while (todoList === null || todoList === void 0 ? void 0 : todoList.firstChild) {
                todoList.removeChild(todoList.firstChild);
            }
            while (reminderList === null || reminderList === void 0 ? void 0 : reminderList.firstChild) {
                reminderList.removeChild(reminderList.firstChild);
            }
            // Renderiza as tarefas de acordo com o modo atual
            tasks.forEach((task) => {
                const row = document.createElement("tr");
                const descriptionCell = document.createElement("td");
                descriptionCell.textContent = task.description;
                row.appendChild(descriptionCell);
                if (task instanceof Todo) {
                    const doneCell = document.createElement("td");
                    doneCell.textContent = task.done ? "Yes" : "No";
                    row.appendChild(doneCell);
                    const actionsCell = document.createElement("td");
                    const editButton = document.createElement("button");
                    editButton.innerHTML = `<i class="fas fa-cog" title="Edit"></i>`;
                    editButton.onclick = () => handleEditTask(task);
                    const deleteButton = document.createElement("button");
                    deleteButton.innerHTML = `<i class="fas fa-trash" title="Delete"></i>`;
                    deleteButton.onclick = () => handleDeleteTask(task.id);
                    const toggleButton = document.createElement("button");
                    toggleButton.innerHTML = `<i class="fas fa-check" title="Toggle Done"></i>`;
                    toggleButton.onclick = () => handleToggleDone(task.id);
                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);
                    actionsCell.appendChild(toggleButton);
                    row.appendChild(actionsCell);
                    todoList === null || todoList === void 0 ? void 0 : todoList.appendChild(row);
                }
                else if (task instanceof Reminder) {
                    const dateCell = document.createElement("td");
                    dateCell.textContent = DateUtils.formatDate(task.date);
                    row.appendChild(dateCell);
                    const platformCell = document.createElement("td");
                    platformCell.textContent = task.notifications.join(", ");
                    row.appendChild(platformCell);
                    const actionsCell = document.createElement("td");
                    const editButton = document.createElement("button");
                    editButton.innerHTML = `<i class="fas fa-cog" title="Edit"></i>`;
                    editButton.onclick = () => handleEditTask(task);
                    const deleteButton = document.createElement("button");
                    deleteButton.innerHTML = `<i class="fas fa-trash" title="Delete"></i>`;
                    deleteButton.onclick = () => handleDeleteTask(task.id);
                    actionsCell.appendChild(editButton);
                    actionsCell.appendChild(deleteButton);
                    row.appendChild(actionsCell);
                    reminderList === null || reminderList === void 0 ? void 0 : reminderList.appendChild(row);
                }
            });
            // Exibe ou oculta os formulários de acordo com o modo atual
            const todoSet = document.getElementById("todoSet");
            const reminderSet = document.getElementById("reminderSet");
            if (mode === ViewMode.TODO) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("style", "display: block");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute("disabled");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("style", "display: none");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("disabled", "true");
            }
            else {
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("style", "display: block");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute("disabled");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("style", "display: none");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("disabled", "true");
            }
        },
    };
    // Carrega as tarefas armazenadas no localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    let mode = ViewMode.TODO;
    // Salva as tarefas no localStorage
    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };
    // Manipula o evento de submissão do formulário
    const handleEvent = (event) => {
        event.preventDefault();
        const form = event.target;
        switch (mode) {
            case ViewMode.TODO:
                tasks.push(taskView.getTodo(form));
                break;
            case ViewMode.REMINDER:
                tasks.push(taskView.getReminder(form));
        }
        saveTasks();
        taskView.render(tasks, mode);
    };
    // Alterna entre os modos TODO e REMINDER
    const handleToggleMode = () => {
        mode = mode === ViewMode.TODO ? ViewMode.REMINDER : ViewMode.TODO;
        taskView.render(tasks, mode);
    };
    // Manipula a edição de uma tarefa
    const handleEditTask = (task) => {
        const newDescription = prompt("Edit description:", task.description);
        if (newDescription !== null) {
            if (task instanceof Todo) {
                task.update(newDescription);
            }
            else if (task instanceof Reminder) {
                const newDate = prompt("Edit date (YYYY-MM-DD):", DateUtils.formatDate(task.date));
                const newNotifications = prompt("Edit notifications (comma-separated):", task.notifications.join(","));
                if (newDate !== null && newNotifications !== null) {
                    const parsedDate = new Date(newDate);
                    const parsedNotifications = newNotifications.split(",");
                    task.update(newDescription, parsedDate, parsedNotifications);
                }
            }
            saveTasks();
            taskView.render(tasks, mode);
        }
    };
    // Manipula a exclusão de uma tarefa
    const handleDeleteTask = (id) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
            saveTasks();
            taskView.render(tasks, mode);
        }
    };
    // Alterna o estado de conclusão de uma tarefa
    const handleToggleDone = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.toggleDone();
            saveTasks();
            taskView.render(tasks, mode);
        }
    };
    // Adiciona os manipuladores de eventos aos elementos do DOM
    (_a = document.getElementById("taskForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", handleEvent);
    (_b = document.getElementById("toggleMode")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", handleToggleMode);
    // Renderiza as tarefas inicialmente
    taskView.render(tasks, mode);
})();
