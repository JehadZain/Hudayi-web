// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import { useLocales } from '../../../../locales';

import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const { translate } = useLocales();
  return (
    <>
      <Head>
        <title> {translate('schools.add')}| {translate('hudayi')} </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('schools.add')}
          links={[
            { name:  translate('homPage') , href: PATH_DASHBOARD.root },
            { name: translate('schools.schools'), href: PATH_DASHBOARD.schools.root },
            { name: translate('schools.add'), href: PATH_DASHBOARD.schools.modifiye },
          ]}
        />
      </Container>
    </>
  );
}
