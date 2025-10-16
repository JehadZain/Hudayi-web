import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import { useLocales } from 'src/locales';

const PropertyAutocomplete = ({ properties, onChange }) => {
  const handleChange = (event, value) => {
    if (onChange) {
      onChange(value);
    }
  };

  const { translate } = useLocales();

  return (
    <Autocomplete
      fullWidth
      onChange={handleChange}
      options={properties}
      getOptionLabel={(option) => option?.name || ''}
      renderInput={(params) => <TextField label={translate('properties.name')} {...params} />}
    />
  );
};

// Add PropTypes validation
PropertyAutocomplete.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ).isRequired,
  onChange: PropTypes.func
};

// Add default props (optional)
PropertyAutocomplete.defaultProps = {
  onChange: null
};

export default PropertyAutocomplete;