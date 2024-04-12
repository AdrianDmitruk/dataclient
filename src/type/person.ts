export interface PersonData {
  currentPage: number;
  persons: Person[];
  totalPages: number;
  totalPersons: number;
}

export interface Person {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: Date | null;
  passport: string;
}

export interface CreatePerson extends Omit<Person, "_id"> {}
