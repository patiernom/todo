export const getTodos = async () =>
  await fetch("http://localhost:3000/todos").then((res) => res.json());
