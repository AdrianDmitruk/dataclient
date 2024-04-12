import {
  Container,
  Flex,
  Loader,
  Pagination,
  Paper,
  Title,
} from "@mantine/core";
import classes from "./App.module.css";
import { AddModal, UserTable } from "./components";
import { useAllPersons } from "./hooks";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { constants } from "./services";

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setCurrentPage(Number(pageParam));
    } else {
      navigate(`?page=1`);
    }
  }, [location.search, navigate]);

  const persons = useAllPersons(currentPage, constants.PAGE_SIZE);

  useEffect(() => {
    if (
      persons.data &&
      persons.data.data.persons.length === 0 &&
      persons.data.data.totalPages > 0
    ) {
      const previousPage = Math.max(currentPage - 1, 1);
      navigate(`?page=${previousPage}`);
      setCurrentPage(previousPage);
    }
  }, [persons.data, currentPage, navigate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(
      page === 1 ? location.pathname : `${location.pathname}?page=${page}`
    );
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get("page");
    if (!pageParam && currentPage !== 1) {
      navigate(`?page=1`);
    }
  }, [location.search, currentPage, navigate]);

  useEffect(() => {
    if (
      persons.data &&
      persons.data.data.totalPages === 1 &&
      persons.data.data.persons.length <= constants.PAGE_SIZE
    ) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.delete("page");
      navigate(`${location.pathname}?${searchParams.toString()}`);
    }
  }, [persons.data, location.pathname, location.search, navigate]);

  return (
    <div className={classes.wrap}>
      <Container size="xl" p="md" h="100%">
        <Paper shadow="xs" withBorder p="md" radius="md">
          <AddModal />
          {persons.isLoading && (
            <Flex justify="center">
              <Loader color="blue" />
            </Flex>
          )}
          {persons.isFetched && !!persons.data?.data.persons.length && (
            <UserTable data={persons.data.data.persons} />
          )}

          {!persons.data?.data.persons.length && (
            <Flex justify="center">
              <Title>Записи отсутствуют</Title>
            </Flex>
          )}

          {persons.data && persons.data.data.totalPages > 1 && (
            <Flex justify="center">
              <Pagination
                total={persons.data ? persons.data.data.totalPages : 0}
                value={currentPage}
                onChange={handlePageChange}
                radius="md"
                mt="md"
              />
            </Flex>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default App;
