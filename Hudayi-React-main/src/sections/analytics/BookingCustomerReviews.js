import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useRef, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Card,
  Chip,
  Stack,
  Avatar,
  Rating,
  Button,
  CardHeader,
  Typography,
  Divider,
} from '@mui/material';
import { useLocales } from '../../locales';

import { fDateTime } from '../../utils/formatTime';
// components
import Iconify from '../../components/iconify';
import Carousel, { useCarousel, CarouselArrows } from '../../components/carousel';

// ----------------------------------------------------------------------

BookingCustomerReviews.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.string,
  allOnTap: PropTypes.string,
  monthlyOnTap: PropTypes.string,
  weeklyOnTap: PropTypes.string,
  dateOnTap: PropTypes.string,
  date: PropTypes.string,
};

export default function BookingCustomerReviews({
  title,
  allOnTap,
  dateOnTap,
  weeklyOnTap,
  monthlyOnTap,
  list,
  date,
  ...other
}) {
  const carousel = useCarousel({
    adaptiveHeight: true,
  });
  const { translate } = useLocales();

  // />;
  const theme = useTheme();
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={'\n '}
        action={<></>}
        sx={{
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
      />
      <Divider />
      &nbsp;
      <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
        sx={{
          p: theme.spacing(0, 3, 3, 3),
        }}
      >
        <Button fullWidth color="success" variant="contained" onClick={() => allOnTap()}>
          {translate('all')}
        </Button>
      </Stack>
      <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
        sx={{
          p: theme.spacing(0, 3, 3, 3),
        }}
      >
        <Button fullWidth color="success" variant="contained" onClick={() => dateOnTap()}>
          {date}
        </Button>
      </Stack>
      <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
        sx={{
          p: theme.spacing(0, 3, 3, 3),
        }}
      >
        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="bi:calendar2-week" />}
          onClick={() => weeklyOnTap()}
        >
          {translate('weekly')}
        </Button>

        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="formkit:month" />}
          onClick={() => monthlyOnTap()}
        >
          {translate('monthly')}
        </Button>
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  item: PropTypes.shape({
    tags: PropTypes.array,
    name: PropTypes.string,
    avatar: PropTypes.string,
    rating: PropTypes.number,
    description: PropTypes.string,
    postedAt: PropTypes.instanceOf(Date),
  }),
};

function ReviewItem({ item }) {
  const { avatar, name, description, rating, postedAt, tags } = item;

  return (
    <Stack
      spacing={2}
      sx={{
        position: 'relative',
        p: (theme) => theme.spacing(3, 3, 2, 3),
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={name} src={avatar} />

        <div>
          <Typography variant="subtitle2">{name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            Posted {fDateTime(postedAt)}
          </Typography>
        </div>
      </Stack>

      <Rating value={rating} size="small" readOnly precision={0.5} />

      <Typography variant="body2">{description}</Typography>

      <Stack direction="row" flexWrap="wrap">
        {tags.map((tag) => (
          <Chip size="small" key={tag} label={tag} sx={{ mr: 1, mb: 1, color: 'text.secondary' }} />
        ))}
      </Stack>
    </Stack>
  );
}
