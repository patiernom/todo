import axios from "axios";

export const getTodos = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/todos");

    return data.todos;
  } catch (err) {
    console.error(err);
  }
};

export const createTodo = async (title: String) => {
  try {
    const { data } = await axios.post("http://localhost:3000/todos", { title });

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteTodo = async (id: Number) => {
  try {
    await axios.delete(`http://localhost:3000/todos/${id}`);
  } catch (err) {
    console.error(err);
  }
};

export const updateTodo = async ({
  id,
  title,
  completed,
}: {
  id: Number;
  title?: String;
  completed?: Boolean;
}) => {
  try {
    const { data } = await axios.put(`http://localhost:3000/todos/${id}`, {
      completed,
      title,
    });

    return data;
  } catch (err) {
    console.error(err);
  }
};
