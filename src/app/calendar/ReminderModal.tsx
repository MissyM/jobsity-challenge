import { useForm, Controller } from 'react-hook-form';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful/dist/index.css';
import React from 'react';
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
} from '@chakra-ui/react';

export default function ReminderModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { handleSubmit, errors, register, control, formState } = useForm();

  function validateTitle(value: any) {
    if (!value) {
      return 'Please write a title';
    } else if (value.length > 30) {
      return 'Max 30 chars please';
    } else return true;
  }

  function onSave(values: any) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve();
      }, 3000);
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSave)}>
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
                    <>
                      <Box
                        w="201px"
                        h="40px"
                        marginBottom="10px"
                        backgroundColor={value}
                        borderRadius="0.375rem"
                      ></Box>
                      <HexColorPicker color={value} onChange={onChange} />
                    </>
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
