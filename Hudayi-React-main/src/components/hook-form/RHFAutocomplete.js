import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  textFieldOnChange: PropTypes.func
};

export default function RHFAutocomplete({ name, label, helperText, textFieldOnChange, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          noOptionsText='لا توجد خيارات, قم بكتابة الأسم المراد لعرض الخيارات'
          renderInput={(params) => (
            <TextField
              label={label}
              error={!!error}
              onChange={(event) => {
                textFieldOnChange(event);
              }}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
