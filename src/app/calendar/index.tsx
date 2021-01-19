import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidV4 } from 'uuid';

import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';

import ReminderModal, { Reminder } from './ReminderModal';
import HeaderWeek from './HeaderWeek';

type Day = null | { dayNum: number; reminders: Reminder[] };
type Calendar = Day[][];

const currentDate = new Date().getDate();
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export default function CalendarRendering() {
  const [gridCalendar, setGridCalendar] = useState<Calendar | null>();
  const [currentReminder, setCurrentReminder] = useState<Reminder>();
  const [currentDayNum, setCurrentDayNum] = useState<number>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const now = new Date();
    // Get initial day of month
    const startWeekDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getDay();
    // Get the number of days
    const numDays = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const generatedCalendar = generateCalendar(startWeekDay, numDays); // Get generated calendar
    setGridCalendar(generatedCalendar); // Set calendar on state
  }, []);

  const handleDayClick = (dayNum?: number) => {
    setCurrentDayNum(dayNum);
    onOpen();
  };

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

        if (gridCalendar) {
          if (currentReminder) {
            for (
              let weekIndex = 0;
              weekIndex < gridCalendar?.length;
              weekIndex++
            ) {
              for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const remindersList =
                  gridCalendar[weekIndex][dayIndex]?.reminders;
                if (remindersList) {
                  for (
                    let reminderIndex = 0;
                    reminderIndex < remindersList.length;
                    reminderIndex++
                  ) {
                    // Allow edit and save reminder object

                    if (
                      remindersList[reminderIndex].id === currentReminder.id
                    ) {
                      remindersList[reminderIndex] = {
                        ...reminder,
                        id: currentReminder.id, //Conserve the id in the edited reminder
                      };
                      // Sort new reminders
                      const dayObj = gridCalendar[weekIndex][dayIndex];
                      if (dayObj) {
                        dayObj.reminders = sortReminders(remindersList);
                      }
                    }
                  }
                }
              }
            }
          } else {
            // Save new reminder

            const id = uuidV4(); // Assign new id with uuidV4 library
            const date = reminder.date.getDate();

            // Goes through every week of the month
            for (
              let weekIndex = 0;
              weekIndex < gridCalendar.length;
              weekIndex++
            ) {
              // goes through every day of the week
              for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const day = gridCalendar[weekIndex][dayIndex];
                // Validate day existency and the dates match
                if (day && day.dayNum === date) {
                  day.reminders.push({ id, ...reminder }); // Push the new reminder
                  //Sort reminders saved
                  const dayObj = gridCalendar[weekIndex][dayIndex];
                  if (dayObj) {
                    dayObj.reminders = sortReminders(day.reminders);
                  }
                }
              }
            }
          }
          //Display reminders on the calendar view in the correct time order.
          setGridCalendar(gridCalendar);
        }

        onClose();
        resolve();
      }, 600); // This simulates a server request
    });
  };

  return (
    <Box p="10px">
      <HeaderWeek />
      {gridCalendar &&
        gridCalendar.map((week, i) => (
          <Grid templateColumns="repeat(7, 1fr)" key={i}>
            {week.map((day, j) => (
              <Box
                key={j}
                height="200px"
                w="100%"
                p="30px 0px 0px 0px"
                position="relative"
                border={'1px solid rgb(226, 232, 240)'}
                fontSize="14px"
                fontWeight="600"
                color="#70757a"
                overflow="auto"
                onClick={() => handleDayClick(day?.dayNum)}
              >
                <Flex
                  justify="center"
                  align="center"
                  position="absolute"
                  w="27px"
                  h="27px"
                  top="5px"
                  left="5px"
                  fontWeight="600"
                  {...(currentDate === day?.dayNum
                    ? {
                        color: '#fff',
                        borderRadius: '50%',
                        backgroundColor: '#3182ce',
                      }
                    : {
                        _hover: {
                          backgroundColor: '#dadce0',
                          borderRadius: '50%',
                        },
                      })}
                >
                  {day && day.dayNum}
                </Flex>
                {day?.reminders.map((reminder, idx) => (
                  <Flex
                    align="center"
                    key={idx}
                    m="5px"
                    p="2px 5px"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentReminder(reminder);
                      onOpen();
                    }}
                    _hover={{
                      backgroundColor: '#dadce0',
                      borderRadius: '10px',
                    }}
                  >
                    <Box
                      w="10px"
                      h="10px"
                      marginRight="5px"
                      borderRadius="50%"
                      backgroundColor={reminder.color}
                      flexShrink={0}
                    />
                    <Box
                      fontWeight="500"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {reminder.title}
                    </Box>
                  </Flex>
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
      <ReminderModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setCurrentReminder(undefined);
        }}
        onSubmit={onSubmit}
        currentReminder={currentReminder}
        currentDayNum={currentDayNum}
      />
    </Box>
  );
}

function generateCalendar(startWeekDay: number, numDays: number) {
  const calendar: Array<any> = [[]];
  let colIndex = 0;

  // Starting month with null
  for (colIndex = 0; colIndex < startWeekDay; colIndex++) {
    calendar[0].push(null); // [[null,null,...]], and colIndex incremented
  }

  // Fill the calendar with the day numbers and their respective remainders
  let week = 0; // [0,1,2,3,4...]
  for (let dayNum = 1; dayNum <= numDays; dayNum++) {
    const dayObj = {
      dayNum,
      reminders: [],
    }; // Object with dayNum and list of reminders for each day
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
const sortReminders = (reminderList: Reminder[]) => {
  return reminderList.sort(
    (reminderA: Reminder, reminderB: Reminder) =>
      reminderA.date.getTime() - reminderB.date.getTime()
  );
};
