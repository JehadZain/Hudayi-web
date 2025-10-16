// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import PropertyNewEditForm from '../../../../sections/property/PropertyNewEditForm';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useLocales } from '../../../../locales';

import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { get } from '../../../../utils/functions';
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

    const getProperty = async () => {
      const property = await get('properties', id, enqueueSnackbar);
      if (isMounted) {
        setData(property.data);
      }
    };

    getProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <Head>
        <title>
          
          {translate('properties.properties')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('properties.properties')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('properties.properties'), href: PATH_DASHBOARD.property.root },
            { name: translate('properties.add'), href: PATH_DASHBOARD.property.modifiye('new') },
          ]}
        />
        <PropertyNewEditForm isEdit={id !== 'new' } currentProduct={data} />
      </Container>
    </>
  );
}
