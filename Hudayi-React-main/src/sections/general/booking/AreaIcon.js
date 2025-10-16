import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import BackgroundIllustration from './BackgroundIllustration';

// ----------------------------------------------------------------------

function AreaIcon({ ...other }) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path d="m18 24l-6 9l-8-4.5V42h40V15l-7 8l-6-5l-7 8l-6-2Z"/><path d="M4 28.5V17l7 6l5.5-8l6 3L31 9l5.5 4.5L44 6v9.5"/></g></svg>
    </Box>
  );
}

export default memo(AreaIcon);
