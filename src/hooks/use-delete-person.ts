import { deletePerson } from "@/services";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePerson(id),

    onSuccess: () => {
      notifications.show({
        color: "green",
        title: "Успех",
        message: "Пользователь успешно удален",
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
