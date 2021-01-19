import React from 'react';
import { Flex, Grid } from '@chakra-ui/react';

export default function HeaderWeek() {
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return (
    <Grid templateColumns="repeat(7, 1fr)" fontWeight="500">
      {weekDays.map((day, i) => (
        <Flex
          backgroundColor="#3182ce"
          color="#fff"
          align="center"
          justify="center"
          key={i}
        >
          {day}
        </Flex>
      ))}
    </Grid>
  );
}
