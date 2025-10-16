// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/dashboard';
import SessionNewEditForm from '../../../../sections/sessions/SessionNewEditForm';
import { get } from '../../../../utils/functions';

import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useLocales } from '../../../../locales';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const { translate } = useLocales();
  const [data, setData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getsession = async () => {
      const session = await get('sessions', id, enqueueSnackbar);
      if (isMounted) {
        setData(session.data);
      }
    };

    getsession();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {translate('sessions.add')} | {translate('hudayi')}
        </title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('sessions.sessions')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('sessions.sessions'), href: PATH_DASHBOARD.quranQuizes.root },
            {
              name: translate('sessions.add'),
              href: PATH_DASHBOARD.sessions.modifiye('new'),
            },
          ]}
        />
        <SessionNewEditForm isEdit={id !== 'new' } currentProduct={data} />
      </Container>
    </>
  );
}
