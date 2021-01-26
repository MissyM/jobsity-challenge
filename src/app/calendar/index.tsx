import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Box, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import { IoTrashOutline } from 'react-icons/io5';

import { Reminder, reminderAPI } from './api';
import ReminderModal from './ReminderModal';
import HeaderWeek from './HeaderWeek';

type Day = null | { dayNum: number; reminders: Reminder[] };
type Calendar = Day[][];

const currentDate = new Date().getDate();
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const now = new Date();

// Get initial day of month
const startWeekDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

// Get the number of days
const numDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

export default function CalendarRendering() {
  const [gridCalendar, setGridCalendar] = useState<Calendar | null>();
  const [currentReminder, setCurrentReminder] = useState<Reminder>();
  const [currentDayNum, setCurrentDayNum] = useState<number>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const refreshCalendar = () => {
    reminderAPI.list().then((reminders) => {
      const generatedCalendar = generateCalendar(
        startWeekDay,
        numDays,
        reminders
      ); // Get generated calendar
      setGridCalendar(generatedCalendar); // Set calendar on state
    });
  };

  useEffect(() => {
    refreshCalendar();
  }, []);

  const handleDayClick = (dayNum?: number) => {
    setCurrentDayNum(dayNum);
    onOpen();
  };

  const onSubmit = (reminder: Reminder) => {
    if (
      reminder.date.getFullYear() !== currentYear ||
      reminder.date.getMonth() !== currentMonth
    ) {
      alert('This calendar is for the current month only');
      onClose();
    }

    if (gridCalendar) {
      const promise = currentReminder
        ? reminderAPI.edit({
            id: currentReminder.id,
            ...reminder,
          })
        : reminderAPI.create(reminder);

      promise?.then(() => {
        setCurrentReminder(undefined);
        refreshCalendar();
        onClose();
      });
    }
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
                  top="5px"
                  left="5px"
                  w="27px"
                  h="27px"
                  fontWeight="600"
                  {...(currentDate === day?.dayNum
                    ? {
                        color: '#fff',
                        borderRadius: '50%',
                        backgroundColor: '#3182ce',
                      }
                    : {})}
                >
                  {day && day.dayNum}
                </Flex>
                {day?.reminders.length !== 0 && day !== null && (
                  <Box
                    position="absolute"
                    top="12px"
                    right="5px"
                    cursor="pointer"
                    padding="3px"
                    _hover={{
                      backgroundColor: '#dadce0',
                      borderRadius: '50%',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      reminderAPI.clearDay(day.dayNum).then(() => {
                        refreshCalendar();
                      });
                    }}
                  >
                    <IoTrashOutline />
                  </Box>
                )}

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
                    <Box
                      cursor="pointer"
                      padding="3px"
                      marginLeft="auto"
                      _hover={{
                        backgroundColor: '#dadce0',
                        borderRadius: '50%',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!reminder.id) {
                          return;
                        }
                        reminderAPI.remove(reminder.id).then(() => {
                          refreshCalendar();
                        });
                      }}
                    >
                      <IoTrashOutline />
                    </Box>
                  </Flex>
                ))}
              </Box>
            ))}
          </Grid>
        ))}

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

function generateCalendar(
  startWeekDay: number,
  numDays: number,
  reminders: Reminder[]
) {
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
      reminders: sortReminders(
        reminders.filter((reminder) => reminder.date.getDate() === dayNum)
      ),
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
