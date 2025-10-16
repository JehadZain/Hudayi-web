import PropTypes from 'prop-types';
// @mui
import { Paper, Typography } from '@mui/material';
import { Translate } from '@mui/icons-material';
import { useLocales } from '../../locales';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  query: PropTypes.string,
  sx: PropTypes.object,
};

export default function SearchNotFound({ query, sx, ...other }) {
  const { translate } = useLocales();

  return query ? (
    <Paper
      sx={{
        textAlign: 'center',
        ...sx,
      }}
      
      {...other}
      
    >
      
      <Typography variant="h6" paragraph>
      {translate('pressEnterToStart')}  
      </Typography>

      <Typography variant="body2">
      {translate('whenPressEnter')} &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> .
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      {translate('PleaseEnterKeywords')}  Please enter keywords
    </Typography>
  );
}
