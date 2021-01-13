import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';

import ReminderModal from './ReminderModal';

const reminders = [{ title: 'coso1' }, { title: 'coso2' }, { title: 'coso3' }];

type Reminder = { title: string };
type Day = null | { dayNum: number; reminders: Reminder[] };
type Calendar = Day[][];

export default function Calendar() {
  const [gridCalendar, setGridCalendar] = useState<Calendar | null>();
  console.log(gridCalendar);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <ReminderModal isOpen={isOpen} onClose={onClose} />
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
