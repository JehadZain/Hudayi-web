import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import BackgroundIllustration from './BackgroundIllustration';

// ----------------------------------------------------------------------

function MaintenanceIllustration({ ...other }) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path fill="#2F88FF" fillRule="evenodd" stroke="#000" d="M17 14L44 24V44H17L17 14Z" clipRule="evenodd"/><path stroke="#000" d="M17 14L4 24L4 44H17"/><path stroke="#fff" d="M35 44V32L26 29L26 44"/><path stroke="#000" d="M44 44H17"/></g></svg>

    </Box>
  );
}

export default memo(MaintenanceIllustration);
