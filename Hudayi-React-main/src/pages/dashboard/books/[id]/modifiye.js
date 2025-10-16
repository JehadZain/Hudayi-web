// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import DashboardLayout from '../../../../layouts/dashboard';
import BookNewEditForm from '../../../../sections/books/BookNewEditForm';

import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';

// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const { translate } = useLocales();
  const [data, setData] = useState([]);

  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getbook = async () => {
      const book = await get('books', id);
      if (isMounted) {
        setData(book.data);
      }
    };

    getbook();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {translate('books.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('books.books')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('books.books'), href: PATH_DASHBOARD.books.root },
            {
              name: translate('books.add'),
              href: PATH_DASHBOARD.books.modifiye('new'),
            },
          ]}
        />
        <BookNewEditForm isEdit={id !== 'new' } currentUser={data} />
      </Container>
    </>
  );
}
