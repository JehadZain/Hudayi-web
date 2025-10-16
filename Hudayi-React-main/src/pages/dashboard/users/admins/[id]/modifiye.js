// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../components/settings';
import localStorageAvailable from '../../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import AdminNewEditForm from '../../../../../sections/users/AdminNewEditForm';

import { useLocales } from '../../../../../locales';
import { get } from '../../../../../utils/functions';

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

    const getAdmin = async () => {
      const admin = await get('admins', id);
      if (isMounted) {
        setData(admin.data);
      }
    };

    getAdmin();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {' '}
          {translate('admins.add')}| {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('admins.add')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('admins.admins'), href: PATH_DASHBOARD.users.adminRoot },
            { name: translate('admins.add'), href: PATH_DASHBOARD.users.adminModifiye('new') },
          ]}
        />

        <AdminNewEditForm isEdit={id !== 'new'} currentUser={data} />
      </Container>
    </>
  );
}
