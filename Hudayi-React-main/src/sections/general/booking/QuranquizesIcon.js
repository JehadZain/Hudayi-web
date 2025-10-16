import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import BackgroundIllustration from './BackgroundIllustration';

// ----------------------------------------------------------------------

function QuranquizesIcon({ ...other }) {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  const PRIMARY_DARKER = theme.palette.primary.darker;

  return (
    <Box {...other}>
     <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M24.32 22.39h4v4h-4z"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M34.32 26.39a2 2 0 0 1-2-2v6h-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2h-6v-6a2 2 0 1 1-2-2a2 2 0 0 1 2 2v-6h6a2 2 0 1 1 2-2a2 2 0 0 1-2 2h6v6a2 2 0 1 1 2 2ZM8.4 6.45v35.1a2 2 0 0 0 1.95 2h2.38V4.5h-2.38A2 2 0 0 0 8.4 6.45Z"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.73 4.5v39h24.92a2 2 0 0 0 2-2V6.45a2 2 0 0 0-2-1.95Z"/></svg>
    </Box>
  );
}

export default memo(QuranquizesIcon);
