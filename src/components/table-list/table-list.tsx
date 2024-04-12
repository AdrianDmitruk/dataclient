import { useUpdatePerson } from "@/hooks";
import { useDeletePerson } from "@/hooks/use-delete-person";
import { convertDate, dateParser } from "@/services";
import { CreatePerson, Person } from "@/type/person";
import { ActionIcon, Group, rem, Table, Text, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useMask } from "@react-input/mask";
import { IconCheck, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { ITableListProps } from "./type";

export const TableList: FC<ITableListProps> = ({ item }) => {
  const [isEditId, setIsEditId] = useState<string | null>(null);

  const updatePersonMutation = useUpdatePerson();
  const deletePersonMutation = useDeletePerson();

  const [values, setValues] = useState<CreatePerson>({
    fullName: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: null,
    passport: "",
  });
  const [errors, setErrors] = useState<
    Record<keyof CreatePerson, string | null>
  >({
    fullName: null,
    phoneNumber: null,
    email: null,
    dateOfBirth: null,
    passport: null,
  });

  const inputRef = useMask({
    mask: "+7 (___) ___-__-__",
    replacement: { _: /\d/ },
  });

  const handleEdit = (id: string, person: Person) => {
    setIsEditId(id);
    setValues(person);
    console.log(person);

    setErrors({
      fullName: null,
      phoneNumber: null,
      email: null,
      dateOfBirth: null,
      passport: null,
    });
  };

  const handleClose = () => {
    setIsEditId(null);
  };

  const handleSubmit = () => {
    const validationErrors: Record<keyof CreatePerson, string | null> = {
      fullName: values.fullName.length < 3 ? "Минимум 3 символа" : null,
      phoneNumber:
        values.phoneNumber.length !== 18 ? "Введите корректный номер" : null,
      email: /^\S+@\S+$/.test(values.email) ? null : "Невалидный Email",
      dateOfBirth: values.dateOfBirth
        ? null
        : "Поле обязательно для заполнения",
      passport: !values.passport
        ? "Поле обязательно для заполнения"
        : !/^[A-Z0-9]{5,20}$/.test(values.passport)
        ? "Только латинские буквы и цифры в верхнем регистре"
        : null,
    };
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => !!error)) {
      return;
    }
    if (isEditId && values.dateOfBirth) {
      const valuesWithEditId = { ...values, _id: isEditId };
      updatePersonMutation.mutate(valuesWithEditId);
    }

    handleClose();
  };

  const handleChange = (field: keyof CreatePerson, value: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleRemove = (id: string) => {
    deletePersonMutation.mutate(id);
  };

  const initialDate = dayjs(values.dateOfBirth, "YYYY-MM-DDZ").toDate();

  return (
    <Table.Tr key={item._id}>
      <Table.Td>
        <Group gap="sm">
          {isEditId === item._id ? (
            <TextInput
              variant="filled"
              size="xs"
              radius="md"
              w="100%"
              placeholder={errors.fullName ? errors.fullName : "Введите ФИО"}
              error={!!errors.fullName}
              value={values.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          ) : (
            <Text fz="sm" fw={500}>
              {item.fullName}
            </Text>
          )}
        </Group>
      </Table.Td>

      <Table.Td>
        {isEditId === item._id ? (
          <TextInput
            variant="filled"
            size="xs"
            radius="md"
            w="100%"
            ref={inputRef}
            placeholder={
              errors.phoneNumber ? errors.phoneNumber : "Введите номер телефона"
            }
            error={!!errors.phoneNumber}
            value={values.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        ) : (
          <a href={`tel:${item.phoneNumber}`}>{item.phoneNumber}</a>
        )}
      </Table.Td>
      <Table.Td>
        {isEditId === item._id ? (
          <TextInput
            variant="filled"
            size="xs"
            radius="md"
            w="100%"
            placeholder={errors.email ? errors.email : "Введите Email"}
            error={!!errors.email}
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        ) : (
          <a href={`mailto:${item.email}`}>{item.email}</a>
        )}
      </Table.Td>
      <Table.Td>
        {isEditId === item._id ? (
          <DateInput
            variant="filled"
            size="xs"
            radius="md"
            w="100%"
            dateParser={dateParser}
            valueFormat="DD.MM.YYYY"
            placeholder={
              errors.dateOfBirth ? errors.dateOfBirth : "Введите дату рождения"
            }
            defaultValue={initialDate}
            error={!!errors.dateOfBirth}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => handleChange("dateOfBirth", e)}
          />
        ) : (
          <Text fz="sm">
            {item.dateOfBirth && convertDate(item.dateOfBirth)}
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        {isEditId === item._id ? (
          <TextInput
            variant="filled"
            size="xs"
            radius="md"
            w="100%"
            placeholder={
              errors.passport
                ? errors.passport
                : "Введите серию и номер паспорта"
            }
            error={!!errors.passport}
            value={values.passport}
            onChange={(e) => handleChange("passport", e.target.value)}
          />
        ) : (
          <Text fz="sm">{item.passport}</Text>
        )}
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          {isEditId === item._id ? (
            <ActionIcon variant="subtle" color="gray" onClick={handleSubmit}>
              <IconCheck
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            </ActionIcon>
          ) : (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => handleEdit(item._id, item)}
            >
              <IconPencil
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            </ActionIcon>
          )}

          {isEditId === item._id ? (
            <ActionIcon variant="subtle" color="red" onClick={handleClose}>
              <IconX style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            </ActionIcon>
          ) : (
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleRemove(item._id)}
            >
              <IconTrash
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            </ActionIcon>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};
