import React, { HTMLInputTypeAttribute } from 'react';
import { Grid, TextField, InputAdornment } from '@mui/material';
import { useForm } from './hooks';
import { toKebabCase } from '@/utils/toKebabCase';
import type { InputProps, TextFieldProps } from '@mui/material';
import type { BaseFieldProps } from './types';

export type NibbleFormTextFieldProps = {
  /** Placeholder text used inside the input field to provide hints to the user */
  placeholder?: string;
  /** Disabled property to disable the input if true */
  isDisabled?: boolean;
  /** Custom onBlur event callback */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Custom onChange event callback */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Adornment that appears at the start of the input */
  startAdornment?: React.ReactElement;
  /** Adornment that appears at the end of the input */
  endAdornment?: React.ReactElement;
  /** Defines the input type for the text field. Must be a valid HTML5 input type */
  type?: HTMLInputTypeAttribute;
  /** Props applied to the Input element */
  InputProps?: InputProps;
  /** Attributes applied to the `input` element */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  /** Defines the maximum number of characters the user can enter into the field; mapped to `input` element `maxlength` attribute */
  maxCharacters?: number;
  /** Any valid prop for material ui text input child component - https://material-ui.com/api/text-field/#props */
  muiFieldProps?: TextFieldProps;
} & BaseFieldProps;

function NibbleFormTextField({
  name,
  label,
  size = 'auto',
  placeholder = '- -',
  isDisabled = false,
  onBlur,
  onChange,
  startAdornment,
  endAdornment,
  type = 'text',
  InputProps,
  inputProps = {},
  maxCharacters,
  muiFieldProps = {},
}: NibbleFormTextFieldProps): React.ReactElement {
  const {
    formikField: {field},
    fieldState: {isFieldError, isFieldRequired},
    fieldHelpers: {
      handleBlur,
      handleChange: handleChangeHelper,
      HelperTextComponent,
    },
  } = useForm({
    name,
    onBlur,
    onChange,
  });

  const [valueLength, setValueLength] = React.useState(() => {
    if(typeof field.value === 'string') {
      return field.value.length;
    }

    return 0;
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueLength(event.target.value.length);
    handleChangeHelper(event);
  }

  const maxCharactersValue = inputProps.maxLength || maxCharacters;
  const characterCounter = maxCharactersValue && (
    <small>
      : {valueLength}/{maxCharactersValue}
    </small>
  );

  const labelText = (
    <span>
      {label} {characterCounter}
    </span>
  );

  return (
    <Grid item sm={size}>
      <TextField
        id={toKebabCase(name)}
        color="primary"
        disabled={isDisabled}
        error={isFieldError}
        fullWidth={true}
        InputLabelProps={{shrink: true}}
        InputProps={{
          ...InputProps,
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : null,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : null,
        }}
        inputProps={{
          maxLength: maxCharacters,
          ...inputProps,
        }}
        FormHelperTextProps={{error: isFieldError, style: { display: 'flex', alignItems: 'center'}}}
        name={name}
        type={type}
        label={labelText}
        helperText={!isDisabled && HelperTextComponent}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        required={isFieldRequired}
        value={field.value}
        {...muiFieldProps}
      />
    </Grid>
  );
}

export default NibbleFormTextField;