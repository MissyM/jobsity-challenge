import { useForm, Controller } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import {
  CSSReset,
  FormErrorMessage,
  FormControl,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
} from '@chakra-ui/react';

import LocationInput from './LocationInput';
import { Reminder } from './api';

export default function ReminderModal({
  isOpen,
  onClose,
  onSubmit,
  currentReminder,
  currentDayNum,
}: {
  isOpen: boolean;
  currentReminder?: Reminder;
  currentDayNum?: number;
  onClose: () => void;
  onSubmit: (reminder: Reminder) => void;
}) {
  const {
    handleSubmit,
    errors,
    register,
    control,
    formState,
    reset,
  } = useForm();

  useEffect(() => {
    if (currentDayNum) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      reset({ date: new Date(currentYear, currentMonth, currentDayNum) });
    }
  }, [reset, currentDayNum]);

  useEffect(() => {
    if (currentReminder) {
      reset(currentReminder);
    } else {
      reset();
    }
  }, [reset, currentReminder]);

  function validateTitle(value: any) {
    if (!value) {
      return 'Please write a title';
    } else if (value.length > 30) {
      return 'Max 30 chars please';
    } else return true;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Reminder</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CSSReset />
            <Box p={4}>
              <FormControl isInvalid={errors.title}>
                <Input
                  name="title"
                  placeholder="Add a title to your reminder"
                  ref={register({ validate: validateTitle })}
                />
                <FormErrorMessage>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl paddingTop="10px">
                <Flex>
                  <Controller
                    name="location"
                    control={control}
                    render={({ onChange, value }) => (
                      <LocationInput
                        onLocationChange={onChange}
                        location={value}
                      />
                    )}
                    rules={{ required: true }}
                  />
                  {errors.location?.type === 'required' && (
                    <p
                      style={{
                        color: '#ea4646',
                        paddingLeft: '10px',
                        paddingTop: '5px',
                      }}
                    >
                      Location is required
                    </p>
                  )}
                </Flex>
              </FormControl>

              <FormControl paddingTop="10px">
                <Controller
                  name="date"
                  control={control}
                  defaultValue={new Date()}
                  render={({ onChange, value }) => (
                    <DatePicker
                      selected={value}
                      onChange={onChange}
                      customInput={<Input />}
                      showTimeSelect
                      dateFormat="Pp"
                    />
                  )}
                />
              </FormControl>

              <FormControl paddingTop="10px">
                <Controller
                  name="color"
                  control={control}
                  defaultValue="#fff"
                  render={({ onChange, value }) => (
                    <Box>
                      <Box
                        w="201px"
                        h="40px"
                        marginBottom="10px"
                        backgroundColor={value}
                        borderRadius="0.375rem"
                        border="1px solid rgb(226, 232, 240)"
                      ></Box>
                      <HexColorPicker color={value} onChange={onChange} />
                    </Box>
                  )}
                />
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              type="submit"
              isLoading={formState.isSubmitting}
              colorScheme="blue"
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
