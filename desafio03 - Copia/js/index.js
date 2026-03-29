document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-todo-form");
    const todoList = document.getElementById("todo-list");
    const contadorTarefas = document.getElementById("contador-tarefas");

    // Estado da aplicação
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const init = () => {
        // Carga inicial obrigatória [cite: 50]
        if (tasks.length === 0 && !localStorage.getItem("tasks_initialized")) {
            tasks = [
                { id: 1, desc: "Implementar tela de listagem", tag: "Frontend", done: false },
                { id: 2, desc: "Criar endpoint de cadastro", tag: "Backend", done: false },
                { id: 3, desc: "Protótipo UX", tag: "UX", done: true }
            ];
            localStorage.setItem("tasks_initialized", "true");
            saveAndRender();
        } else {
            render();
        }
    };

    const saveAndRender = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        render();
    };

    const render = () => {
        todoList.innerHTML = tasks.length ? "" : '<p style="text-align:center; color:#b1bacb">Nenhuma tarefa por aqui...</p>';
        
        tasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "todo-item";
            li.dataset.id = task.id; // Guardamos o ID no HTML
            
            li.innerHTML = `
                <div class="task-content">
                    <span class="task-description ${task.done ? 'completed' : ''}">${task.desc}</span>
                    <div class="task-meta">
                        ${task.tag ? `<span class="task-tag">${task.tag}</span>` : ""}
                    </div>
                </div>
                <div class="task-actions">
                    ${task.done ? 
                        `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="Tarefa concluída">
                            <circle cx="16" cy="16" r="16" fill="#00D8A7"/>
                            <path d="M10 16L14 20L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>` : 
                        `<button class="complete-btn" aria-label="Concluir tarefa ${task.desc}">Concluir</button>`
                    }
                </div>
            `;
            todoList.appendChild(li);
        });

        const completedCount = tasks.filter(t => t.done).length;
        contadorTarefas.textContent = `${completedCount} tarefa(s) concluída(s)`; // [cite: 55]
    };

    // Event Delegation: Um único listener para a lista toda
    todoList.addEventListener("click", (e) => {
        if (e.target.classList.contains("complete-btn")) {
            const id = Number(e.target.closest(".todo-item").dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.done = true;
                saveAndRender();
            }
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const descInput = document.getElementById("description");
        const tagInput = document.getElementById("etiqueta");

        if (descInput.value.trim()) {
            tasks.push({
                id: Date.now(),
                desc: descInput.value.trim(),
                tag: tagInput.value.trim(),
                done: false
            });
            saveAndRender();
            form.reset();
            descInput.focus();
        }
    });

    init();
});