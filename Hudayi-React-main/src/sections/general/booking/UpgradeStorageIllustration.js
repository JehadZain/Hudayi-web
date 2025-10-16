import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import BackgroundIllustration from './BackgroundIllustration';

// ----------------------------------------------------------------------

function UpgradeStorageIllustration({ ...other }) {
  const theme = useTheme();

  const PRIMARY_LIGHTER = theme.palette.primary.lighter;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
     <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 256 256"><g fill="none"><rect width="256" height="256" fill="#242938" rx="60"/><path fill="#F1027E" fillRule="evenodd" d="m137.15 52l86.841 63.279v25.237l-86.841 63.655v-25.236l69.533-50.849l-69.533-50.473V52Z" clipRule="evenodd"/><path fill="#F1027E" fillRule="evenodd" d="m137.15 102.849l34.617 25.237l-34.617 25.236v-50.473Z" clipRule="evenodd"/><path fill="#6D6D6D" fillRule="evenodd" d="M119.841 52L33 115.279v25.237l69.533-50.473v101.322l17.308 12.806V52Zm-34.617 76.086L50.31 153.322l34.617 25.236v-50.472h.298Z" clipRule="evenodd"/></g></svg>
    </Box>
  );
}

export default memo(UpgradeStorageIllustration);
