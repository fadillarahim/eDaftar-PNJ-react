import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function TablePaginate(
  {
    id = "",
    tableHead = [],
    tableStatus = "loading",
    paginate = 10,
    tableItem = [],
    customHead = false,
    actionMenu = false,
    tableFooter = [],
    entriesAndSearch = true,
    totalHead = 0,
    searchComponent,
    mb,
    ...rest
  },
  ref
) {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(paginate);

  // useEffect(() => {
  //   setPagination(paginate);
  // }, [paginate])

  const maxPage = useMemo(() => {
    return Math.ceil(tableItem.length / pagination);
  }, [pagination, tableItem]);
  const [firstData, setFirstData] = useState(0);
  const [lastData, setLastData] = useState(pagination);
  const [currPage, setCurrPage] = useState(1);

  const handleNext = () => {
    if (currPage < maxPage) {
      setFirstData(firstData + pagination);
      setLastData(lastData + pagination);
      setCurrPage(currPage + 1);
    }
  };

  const handleBack = () => {
    if (currPage > 1) {
      setFirstData(firstData - pagination);
      setLastData(lastData - pagination);
      setCurrPage(currPage - 1);
    }
  };

  const setTable = useMemo(() => {
    setFirstData(0);
    setLastData(pagination);
    setCurrPage(1);
  }, [pagination]);

  return (
    <>
      {entriesAndSearch && (
        <Flex mb={3} alignItems={"center"} justifyContent={"space-between"}>
          <Flex flexDir={"row"} alignItems={"center"}>
            <Text mr={3} onChange={(e) => setSearch(e.target.value)}>
              Show Entries
            </Text>
            <Input
              w={"60px"}
              defaultValue={paginate}
              // value={paginate}
              textAlign={"center"}
              onChange={(e) => setPagination(parseInt(e.target.value, 10))}
            />
          </Flex>
          <Flex alignItems={"center"} w={"60%"} justifyContent={"flex-end"}>
            {searchComponent}
          </Flex>
        </Flex>
      )}

      <TableContainer
        borderRadius={"md"}
        overflowY={"auto"}
        maxH={"60vh"}
        mb={mb}
        ref={ref}
        {...rest}
      >
        <Table variant={"simple"} id={id}>
          <Thead position={"sticky"} top={0} zIndex={10} background={"white"}>
            {customHead ? (
              tableHead
            ) : (
              <Tr>
                {actionMenu
                  ? tableHead.map((th, i) =>
                      tableHead.length === i + 1 ? (
                        <Th
                          className={"th"}
                          textAlign={"center"}
                          right={0}
                          key={i}
                          position={"sticky"}
                          background={"white"}
                        >
                          {th}
                        </Th>
                      ) : (
                        <Th key={i}>{th}</Th>
                      )
                    )
                  : tableHead.map((th, i) => (
                      <Th className={"th"} textAlign={"center"} key={i}>
                        {th}
                      </Th>
                    ))}
              </Tr>
            )}
          </Thead>
          <Tbody>
            {tableStatus === "loaded" ? (
              tableItem.length === 0 ? (
                <Tr>
                  <Td
                    textAlign={"center"}
                    colSpan={customHead ? totalHead : tableHead.length}
                  >
                    No Item
                  </Td>
                </Tr>
              ) : (
                tableItem.slice(firstData, lastData)
              )
            ) : (
              <Tr>
                <Td colSpan={customHead ? totalHead : tableHead.length}>
                  <Flex
                    w={"full"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Spinner size={"xl"} color={"green.500"} />
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
          {tableFooter.length > 0 ? (
            <Tfoot
              position={"sticky"}
              bottom={0}
              zIndex={0}
              background={"white"}
            >
              {tableFooter}
            </Tfoot>
          ) : (
            ""
          )}
        </Table>
      </TableContainer>

      {entriesAndSearch && (
        <Flex mt={3} justifyContent={"space-between"}>
          <Text>
            Showing {firstData + 1} to{" "}
            {currPage === maxPage ? tableItem.length : lastData} of{" "}
            {tableItem.length} entries
          </Text>
          <Box>
            <IconButton onClick={handleBack} mr={2} icon={<FiChevronLeft />} />
            <IconButton onClick={handleNext} mr={2} icon={<FiChevronRight />} />
          </Box>
        </Flex>
      )}
    </>
  );
}

const forwardedTablePaginate = forwardRef(TablePaginate);
export default forwardedTablePaginate;
