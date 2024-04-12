import { updatePerson } from "@/services";
import { Person } from "@/type/person";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Person) => updatePerson(data),

    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Успех",
        message: "Данные пользователя успешно отредактированы",
      });
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSettled: async (_, error: any, variables) => {
      if (error) {
        notifications.show({
          color: "red",
          title: "Ошибка",
          message: error.response.data.message,
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ["persons"] });
        await queryClient.invalidateQueries({
          queryKey: ["persons", { id: variables._id }],
        });
      }
    },
  });
};
