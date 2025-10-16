import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import BackgroundIllustration from './BackgroundIllustration';

// ----------------------------------------------------------------------

function SubjectsIcons({ ...other }) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path fill="currentColor" d="M13 16H3a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2ZM3 8h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2Zm18 3H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z"/></svg>    </Box>
  );
}

export default memo(SubjectsIcons);
