import { createPerson } from "@/services";
import { CreatePerson } from "@/type/person";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePerson) => createPerson(data),

    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Успех",
        message: "Пользователь успешно добавлен",
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSettled: async (_, error: any) => {
      if (error) {
        notifications.show({
          color: "red",
          title: "Ошибка",
          message: error.response.data.message,
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ["persons"] });
      }
    },
  });
};
