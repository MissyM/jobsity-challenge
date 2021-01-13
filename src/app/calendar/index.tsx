import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { CSSReset, Flex } from '@chakra-ui/react';
import {
  Box,
  Button,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import HookForm from './HookForm';

const reminders = [{ title: 'coso1' }, { title: 'coso2' }, { title: 'coso3' }];

type Reminder = { title: string };
type Day = null | { dayNum: number; reminders: Reminder[] };
type Calendar = Day[][];

export default function Calendar() {
  const [gridCalendar, setGridCalendar] = useState<Calendar | null>();
  console.log(gridCalendar);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startDate, setStartDate] = useState<Date>();

  useEffect(() => {
    const now = new Date(2021, 1, 3);

    const startWeekDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getDay();
    console.log(startWeekDay);
    const numDays = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const calendar = generateCalendar(startWeekDay, numDays, reminders);
    setGridCalendar(calendar);
  }, []);

  return (
    <Box p="10px">
      {gridCalendar &&
        gridCalendar.map((week, i) => (
          <Grid templateColumns="repeat(7, 1fr)" key={i}>
            {week.map((day, j) => (
              <Box
                height="200px"
                w="100%"
                p="20px"
                borderWidth="1px"
                overflow="hidden"
                key={j}
                onClick={onOpen}
              >
                {day && day.dayNum}
              </Box>
            ))}
          </Grid>
        ))}
      <Flex w="full" justify="center">
        <Button variant="link" p="10px 25px">
          Previous
        </Button>
        <Button variant="link" p="10px 25px">
          Next
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reminder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CSSReset />
            <Box p={4}>
              <HookForm />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => {
          setStartDate(date as Date);
          console.log(date.getDay());
        }}
        showTimeSelect
        dateFormat="Pp"
      />
    </Box>
  );
}

function generateCalendar(
  startWeekDay: number,
  numDays: number,
  reminders: any
) {
  const calendar: Array<any> = [[]];
  let colIndex = 0;

  // Starting month with null
  for (colIndex = 0; colIndex < startWeekDay; colIndex++) {
    calendar[0].push(null); // [[0,0,...]], and colIndex incremented
  }

  // Fill the calendar with the day numbers and their respective remainders
  let week = 0; // [0,1,2,3,4...]
  for (let dayNum = 1; dayNum <= numDays; dayNum++) {
    const dayObj = { dayNum, reminders }; // Object with dayNum and list of reminders for each day
    calendar[week][colIndex] = dayObj; // Assign dayObject to each column

    // Condition for changing week
    if (colIndex === 6 && dayNum !== numDays) {
      calendar.push([]); // Insert another array wich is the first week of this month
      week++; // Move a week forward
      colIndex = 0; // Re-start the column
    } else {
      colIndex++;
    }
  }

  // Fill end month with null
  for (; colIndex <= 6; colIndex++) {
    calendar[week][colIndex] = null;
  }

  return calendar;
}
