import axios from "axios";
const baseUrl = "/api/people";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const addPerson = (person) => {
  const request = axios.post(baseUrl, person);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updatePhone = (person, newPhone) => {
  const request = axios.put(`${baseUrl}/${person.id}`, {
    ...person,
    phone: newPhone,
  });
  return request.then((response) => response.data);
};

export default {
  getAll,
  addPerson,
  deletePerson,
  updatePhone,
};
