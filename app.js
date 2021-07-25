const DONE_FILTER = {
  DONE: true,
  UNDONE: false,
  ALL: null,
};

const makeTask = (title, tasks) => {
  const ids = tasks.map((task) => task.id);
  const id = Math.max(...ids) + 1;
  return { id, title, done: false };
};

const Todo = {
  data() {
    return {
      DONE_FILTER: Vue.readonly(DONE_FILTER),
      doneFilter: DONE_FILTER.UNDONE,
      titleFilter: "",
      newTaskTitle: "",
      newTaskFieldsVisible: false,
      editingTaskTitle: "",
      editingTaskFieldsVisible: false,
      editingTask: "",
      tasks: [
        { id: 1, title: "野菜を買う", done: false },
        { id: 2, title: "魚を買う", done: false },
        { id: 3, title: "JavaScriptの勉強をする", done: false },
        { id: 4, title: "原稿を書く", done: false },
      ],
    };
  },
  methods: {
    deleteTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    },
    showNewTaskFields() {
      this.newTaskFieldsVisible = true;
      this.$nextTick(() => {
        this.$refs.newTaskTitle.focus();
      });
    },
    resetNewTaskFields() {
      this.newTaskFieldsVisible = false;
      this.newTaskTitle = "";
      this.$nextTick(() => {
        this.$refs.taskAddBtn.focus();
      });
    },
    addTask(event) {
      if (this.newTaskTitle === "") return;

      const newTask = makeTask(this.newTaskTitle, this.tasks);

      this.tasks = [...this.tasks, newTask];

      this.resetNewTaskFields();
    },
    showEditingTaskFields(task) {
      this.editingTaskFieldsVisible = true;
      this.editingTaskTitle = task.title;
      this.editingTask = task;
      this.$nextTick(() => {
        this.$refs.editingTaskTitle.select();
      });
    },
    getEditBtnId(taskId) {
      return `taskEditBtn${taskId}`;
    },
    hideEditingTaskFields() {
      this.editingTaskFieldsVisible = false;
      const editBtnId = this.getEditBtnId(this.editingTask.id);
      this.$nextTick(() => {
        this.$refs[editBtnId].focus();
      });
    },
    editTask() {
      this.editingTask.title = this.editingTaskTitle;
      this.hideEditingTaskFields();
    },
    isEditingTask(task) {
      return this.editingTaskFieldsVisible && this.editingTask.id === task.id;
    },
  },
  computed: {
    filterdTasks() {
      const noFilter =
        this.titleFilter === "" && this.doneFilter === DONE_FILTER.ALL;
      if (noFilter) {
        return this.tasks;
      }

      return this.tasks.filter((task) => {
        const titleMatched = this.titleFilterExp.test(task.title);

        const doneMatched =
          this.doneFilter === DONE_FILTER.ALL || this.doneFilter === task.done;

        return titleMatched && doneMatched;
      });
    },
    titleFilterExp() {
      return new RegExp(this.titleFilter);
    },
  },
};

const todoApp = Vue.createApp(Todo);
todoApp.mount("#todoApp");
