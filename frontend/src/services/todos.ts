import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TODOS_ENDPOINT = `${API_BASE_URL}/todos`;

export const getTodos = async () => {
  try {
    const { data } = await axios.get(`${TODOS_ENDPOINT}`);

    return data.todos;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch todos: ${err}`);
  }
};

export const createTodo = async (title: String) => {
  try {
    const { data } = await axios.post(`${TODOS_ENDPOINT}`, { title });

    return data;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to create todo: ${err}`);
  }
};

export const deleteTodo = async (id: Number) => {
  try {
    await axios.delete(`${TODOS_ENDPOINT}/${id}`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to delete todo: ${err}`);
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
    const { data } = await axios.put(`${TODOS_ENDPOINT}/${id}`, {
      completed,
      title,
    });

    return data;
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to update todo: ${err}`);
  }
};
