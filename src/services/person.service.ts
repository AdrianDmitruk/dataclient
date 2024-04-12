import { axiosBase } from "@/api/interceptors";
import { CreatePerson, Person, PersonData } from "@/type/person";
import { constants } from "./constants.service";

export const getAllPersons = async (params?: {
  page?: number;
  pageSize?: number;
}) => {
  return await axiosBase.get<PersonData>(
    `${constants.PATH_API}?page=${params?.page}&pageSize=${params?.pageSize}`
  );
};

export const createPerson = async (data: CreatePerson) => {
  return await axiosBase.post<Person>(constants.PATH_API, data);
};

export const updatePerson = async (data: Person) => {
  return await axiosBase.put<Person>(`${constants.PATH_API}/${data._id}`, data);
};

export const deletePerson = async (id: string) => {
  return await axiosBase.delete<Person>(`${constants.PATH_API}/${id}`);
};
