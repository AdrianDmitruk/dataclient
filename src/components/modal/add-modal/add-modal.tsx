import {
  Button,
  Flex,
  Loader,
  LoadingOverlay,
  Modal,
  TextInput,
} from "@mantine/core";
import { useMask } from "@react-input/mask";
import { FC, useEffect } from "react";
import { DateInput } from "@mantine/dates";
import { dateParser } from "@/services";
import { useForm, hasLength } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { CreatePerson } from "@/type/person";
import { useCreatePerson } from "@/hooks";

export const AddModal: FC = () => {
  const createPerson = useCreatePerson();

  const form = useForm({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: null,
      passport: "",
    },

    validate: {
      fullName: hasLength(
        { min: 3 },
        "Поле обязательно для заполнения, минимум 3 символа"
      ),
      phoneNumber: hasLength(
        { min: 18, max: 18 },
        "Введите корректный номер телефона"
      ),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Невалидный Email"),
      dateOfBirth: (value) =>
        value ? null : "Поле обязательно для заполнения",
      passport: (value) => {
        if (!value) {
          return "Поле обязательно для заполнения";
        }
        if (!/^[A-Z0-9]{5,20}$/.test(value)) {
          return "Только латинские буквы и цифры в верхнем регистре";
        }
        return null;
      },
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  const [visible] = useDisclosure(true);

  const inputRef = useMask({
    mask: "+7 (___) ___-__-__",
    replacement: { _: /\d/ },
  });

  useEffect(() => {
    if (createPerson.error) {
      createPerson.error.response.data.message ===
        "Электронная почта уже используется" &&
        form.setFieldError("email", createPerson.error.response.data.message);
      createPerson.error.response.data.message ===
        "Номер телефона уже используется" &&
        form.setFieldError(
          "phoneNumber",
          createPerson.error.response.data.message
        );
    }
    if (!opened) {
      form.setFieldError("fullName", null);
      form.setFieldError("phoneNumber", null);
      form.setFieldError("email", null);
      form.setFieldError("dateOfBirth", null);
      form.setFieldError("passport", null);
    }
  }, [close, createPerson.error, opened]);

  useEffect(() => {
    if (createPerson.isSuccess) {
      close();
      form.reset();
    }
  }, [close, createPerson.isSuccess]);

  const handleSubmit = (values: CreatePerson) => {
    createPerson.mutate(values);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Введите данные нового пользователя"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 1,
        }}
      >
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{ position: "relative" }}
        >
          <LoadingOverlay
            visible={createPerson.isPending && visible}
            style={{ borderRadius: "var(--mantine-radius-md)" }}
            loaderProps={{ children: <Loader color="blue" /> }}
          />

          <TextInput
            placeholder="Введите ФИО"
            mb="md"
            radius="md"
            {...form.getInputProps("fullName")}
          />
          <TextInput
            placeholder="Введите номер телефона"
            ref={inputRef}
            mb="md"
            radius="md"
            {...form.getInputProps("phoneNumber")}
          />
          <TextInput
            placeholder="Введите Email"
            mb="md"
            radius="md"
            {...form.getInputProps("email")}
          />
          <DateInput
            dateParser={dateParser}
            valueFormat="DD.MM.YYYY"
            placeholder="Введите дату рождения"
            mb="md"
            radius="md"
            {...form.getInputProps("dateOfBirth")}
          />
          <TextInput
            placeholder="Введите серию и номер паспорта"
            mb="md"
            radius="md"
            {...form.getInputProps("passport")}
          />

          <Button radius="md" type="submit" fullWidth>
            Создать
          </Button>
        </form>
      </Modal>
      <Flex justify="center" mb="md">
        <Button onClick={open}>Добавить пользователя</Button>
      </Flex>
    </>
  );
};
