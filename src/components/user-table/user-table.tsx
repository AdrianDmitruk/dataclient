import { FC } from "react";
import { Table } from "@mantine/core";
import { IUserTableProps } from "./type";
import { TableList } from "../table-list";

export const UserTable: FC<IUserTableProps> = ({ data }) => {
  return (
    <Table verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ФИО</Table.Th>
          <Table.Th>Номер телефона</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Дата рождения</Table.Th>
          <Table.Th>Серия и номер паспорта</Table.Th>
          <Table.Th />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((elem) => (
          <TableList key={elem._id} item={elem} />
        ))}
      </Table.Tbody>
    </Table>
  );
};
