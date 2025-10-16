import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { Container, Box, Card, Grid, CardContent, Typography } from '@mui/material';
import { alpha, useTheme, styled } from '@mui/material/styles';
import { fDate } from '../../../../utils/formatTime';

import { get } from '../../../../utils/functions';
import Label from '../../../../components/label';

import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../../components/custom-avatar';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Carousel, { CarouselDots } from '../../../../components/carousel';
import Image from '../../../../components/image';
import { bgGradient } from '../../../../utils/cssStyles';
import { imageLink } from 'src/auth/utils';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

View_book.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
const StyledOverlay = styled('div')(({ theme }) => ({
  ...bgGradient({
    startColor: `${alpha(theme.palette.common.black, 0)} 0%`,
    endColor: `${theme.palette.common.black} 75%`,
  }),
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 8,
  position: 'absolute',
}));

// ----------------------------------------------------------------------

View_book.propTypes = {
  list: PropTypes.array,
};

// ----------------------------------------------------------------------

export default function View_book({ list, ...other }) {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const { translate } = useLocales();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getbook = async () => {
      const book = await get('books', id, enqueueSnackbar);
      if (isMounted) {
        setData(book.data);
      }
    };

    getbook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const theme = useTheme();
  const ICONS = {
    book: 'fluent-emoji-flat:books',
  };

  return (
    <>
      <Head>
        <title>
          {translate('books.books')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('books.books')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('books.books'), href: PATH_DASHBOARD.books.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.books.root },
          ]}
          sx={{
            mt: 4,
          }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Box sx={{ mb: 5, position: 'relative', height: '155px' }}>
                {data?.image ? (
                  <Image
                    alt={data.image}
                    src={`${imageLink}/${data.image}`}
                    sx={{
                      height: 'auto',
                      width: '30%',
                      margin: 'auto',

                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Iconify
                    icon={ICONS.book}
                    width="50%"
                    height="30%"
                    style={{ margin: 'auto', objectFit: 'cover' }}
                  />
                )}
                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: 'auto',
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}
                  variant="p"
                >
                  <p
                    style={{
                      marginLeft: '10px',
                      opacity: '0.5',
                      textAlign: 'center',
                      justifyContent: 'center',
                      marginTop: '35px',
                    }}
                  />
                  <span style={{ textAlign: 'center' }}>{data?.name}</span>
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                  variant="p"
                >
                  {' '}
                  <p style={{ marginLeft: '10px', opacity: '0.5' }}>
                    {translate('books.book_type')}:
                  </p>{' '}
                  <span>{data?.book_type}</span>
                </Typography>

                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                  variant="p"
                >
                  {' '}
                  <p style={{ marginLeft: '10px', opacity: '0.5' }}>
                    {translate('books.booksId')}:
                  </p>{' '}
                  <span>{data?.id}</span>
                </Typography>

                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                  variant="p"
                >
                  {' '}
                  <p style={{ marginLeft: '10px', opacity: '0.5' }}>
                    {translate('books.author_name')}:
                  </p>{' '}
                  <span>{data?.author_name}</span>
                </Typography>

                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                  variant="p"
                >
                  <p style={{ marginLeft: '10px', opacity: '0.5' }}>
                    {translate('books.property_type')}:
                  </p>

                  {data?.property_type === 'مدرسة'
                    ? translate('properties.school_translation')
                    : translate('properties.mosque_translation')}
                </Typography>

                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                  variant="p"
                >
                  {' '}
                  <p style={{ marginLeft: '10px', opacity: '0.5' }}>
                    {translate('books.paper_count')}:
                  </p>{' '}
                  <span>{data?.paper_count}</span>
                </Typography>

                <Typography
                  sx={{ mt: 1, mb: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                  }}
                  variant="p"
                >
                  {' '}
                  <p style={{ marginLeft: '10px', opacity: '0.5' }}>
                    {translate('books.size')}:
                  </p>{' '}
                  <span>{data?.size}</span>
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
