// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, IconButton, Button } from '@mui/material';
import { useRouter } from 'next/router';

import { get } from '../../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../../locales';
import DashboardLayout from '../../../../../../layouts/dashboard';
import PropertyAdminNewEditForm from '../../../../../../sections/users/PropertyAdminNewEditForm';

// components
import { useSettingsContext } from '../../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const [data, setData] = useState([]);
const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();

  const getpropertyAdmin = useCallback(async () => {
    const proprtyAdmin = await get('property/admins', id, enqueueSnackbar);
    setData(proprtyAdmin.data);
  }, [id]);

  useEffect(() => {
    getpropertyAdmin();
  }, [getpropertyAdmin]);
  return (
    <>
      <Head>
        <title>
          {' '}
          {translate('property_admins.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('property_admins.add')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            {
              name: translate('property_admins.property_admins'),
              href: PATH_DASHBOARD.propertyAdmin.root,
            },
            {
              name: translate('property_admins.add'),
              href: PATH_DASHBOARD.propertyAdmin.modifiye('new'),
            },
          ]}
        />
        <PropertyAdminNewEditForm isEdit={id !== 'new'} currentProduct={data} />
      </Container>
    </>
  );
}
