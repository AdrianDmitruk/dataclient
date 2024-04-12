import dayjs from "dayjs";
import { DateInputProps } from "@mantine/dates";

export const dateParser: DateInputProps["dateParser"] = (input) => {
  const [day, month, year] = input.split(".");
  return dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD").toDate();
};
