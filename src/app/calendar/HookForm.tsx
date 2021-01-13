import { useForm } from 'react-hook-form';
import React from 'react';
import { FormErrorMessage, FormControl, Input, Button } from '@chakra-ui/react';

export default function HookForm() {
  const { handleSubmit, errors, register, formState } = useForm();

  function validateTitle(value: any) {
    if (!value) {
      return 'Please write a title';
    } else if (value.length <= 30) {
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
    <form onSubmit={handleSubmit(onSave)}>
      <FormControl>
        <Input
          name="tille"
          placeholder="Add a title to your reminder"
          ref={register({ validate: validateTitle })}
        />
        <FormErrorMessage>
          {errors.title && errors.title.message}
        </FormErrorMessage>
      </FormControl>
    </form>
  );
}
