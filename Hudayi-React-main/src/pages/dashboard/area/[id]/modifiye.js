// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import DashboardLayout from '../../../../layouts/dashboard';
import AreaNewEditForm from '../../../../sections/area/AreaNewEditForm';
// components
import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';

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

    const getArea = async () => {
      const area = await get('branches', id);
      if (isMounted) {
        setData(area.data);
      }
    };

    getArea();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {translate('area.areas')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('area.areas')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('area.areas'), href: PATH_DASHBOARD.area.root },
            {
              name: translate('area.addArea'),
              href: PATH_DASHBOARD.area.modifiye('new'),
            },
          ]}
        />
        <AreaNewEditForm isEdit={id !== 'new'} currentProduct={data} />
      </Container>
    </>
  );
}
