import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidV4 } from 'uuid';

import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';

import ReminderModal, { Reminder } from './ReminderModal';
import { getJSDocReadonlyTag } from 'typescript';

type Day = null | { dayNum: number; reminders: Reminder[] };
type Calendar = Day[][];

const currentDate = new Date().getDate();
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export default function Calendar() {
  const [gridCalendar, setGridCalendar] = useState<Calendar | null>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const now = new Date();

    const startWeekDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getDay();
    const numDays = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const calendar = generateCalendar(startWeekDay, numDays);
    setGridCalendar(calendar);
  }, []);

  const onSubmit = (reminder: Reminder) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (
          reminder.date.getFullYear() !== currentYear ||
          reminder.date.getMonth() !== currentMonth
        ) {
          alert('This calendar is for the current month only');
          onClose();
          reject();
        }
        if (reminder.id) {
        } else {
          const id = uuidV4();
          const date = reminder.date.getDate();

          if (gridCalendar) {
            for (
              let weekIndex = 0;
              weekIndex < gridCalendar.length;
              weekIndex++
            ) {
              for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const day = gridCalendar[weekIndex][dayIndex];

                if (day && day.dayNum === date) {
                  day.reminders.push({ id, ...reminder });
                }
              }
            }
            setGridCalendar(gridCalendar);
          }
        }

        onClose();
        resolve();
      }, 600); // This simulates a server request
    });
  };

  return (
    <Box p="10px">
      {gridCalendar &&
        gridCalendar.map((week, i) => (
          <Grid templateColumns="repeat(7, 1fr)" key={i}>
            {week.map((day, j) => (
              <Box
                key={j}
                height="200px"
                w="100%"
                p="20px"
                position="relative"
                border={
                  '1px solid ' +
                  (currentDate === day?.dayNum ? 'blue' : 'rgb(226, 232, 240)')
                }
                overflow="auto"
                onClick={onOpen}
              >
                <Box position="absolute" top="5px" left="5px">
                  {day && day.dayNum}
                </Box>
                {day?.reminders.map((reminder, idx) => (
                  <Box
                    key={idx}
                    m="10px"
                    p="2px 5px"
                    borderRadius="10px"
                    border={'1px solid ' + reminder.color}
                    cursor="pointer"
                  >
                    {reminder.title}
                  </Box>
                ))}
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
      <ReminderModal isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />
    </Box>
  );
}

function generateCalendar(startWeekDay: number, numDays: number) {
  const calendar: Array<any> = [[]];
  let colIndex = 0;

  // Starting month with null
  for (colIndex = 0; colIndex < startWeekDay; colIndex++) {
    calendar[0].push(null); // [[0,0,...]], and colIndex incremented
  }

  // Fill the calendar with the day numbers and their respective remainders
  let week = 0; // [0,1,2,3,4...]
  for (let dayNum = 1; dayNum <= numDays; dayNum++) {
    const dayObj = { dayNum, reminders: [] }; // Object with dayNum and list of reminders for each day
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
