import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Card, Button, Avatar, Typography, Stack } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { useLocales } from '../../locales';


// ----------------------------------------------------------------------

ProfileNotes.propTypes = {
  note: PropTypes.shape({
    date: PropTypes.string,
    content: PropTypes.string,
    id:PropTypes.string,
}),
};
export default function ProfileNotes({ note  }) {
  const { translate } = useLocales();

  return (
    <>
      <Typography variant="h4" sx={{ my: 5 }}>
        {translate('notes.notesTitle')}
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
       <Box sx={{ p: 3 }}>
        <FollowerCard note={note} />
      </Box>
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

FollowerCard.propTypes = {
  note: PropTypes.shape({
    content: PropTypes.string,
    date: PropTypes.string,
    id: PropTypes.string,
    
  }),
};

function FollowerCard({ note  }) {
  const { content, date ,id } = note;



  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
      }}
    >

      <Box
        sx={{
          pl: 2,
          pr: 1,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
    <Typography variant="body1">{` - ${content}`}</Typography>
      <Typography variant="caption" sx={{ mt: 1 }}>
        {` - ${date}`}
       
      </Typography>
      </Box>

     
    </Card>
  );
}
