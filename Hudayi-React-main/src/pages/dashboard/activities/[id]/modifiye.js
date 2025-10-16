// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import ActivityNewForm from '../../../../sections/activities/ActivityNewForm';

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

    const getActivity = async () => {
      const activity = await get('activities', id);
      if (isMounted) {
        setData(activity.data);
      }
    };

    getActivity();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <Head>
        <title>
          {translate('activities.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('activities.activities')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('activities.activities'), href: PATH_DASHBOARD.activities.root },
            {
              name: translate('activities.add'),
              href: PATH_DASHBOARD.activities.modifiye('new'),
            },
          ]}
        />
        <ActivityNewForm isEdit={id !== 'new' } currentUser={data} />
      </Container>
    </>
  );
}
