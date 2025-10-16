// next
import Head from 'next/head';
import { Container  } from '@mui/material';
import { Translate } from '@mui/icons-material';

import { get } from '../../../../utils/functions';
// layouts
import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();


  return (
    <>
      <Head>
        <title> {translate('mosques.add')}| {translate('hudayi')}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('mosques.add')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('mosques.mosques'), href: PATH_DASHBOARD.mosques.root },
            { name: translate('mosques.add'), href: PATH_DASHBOARD.mosques.modifiye },
          ]}
        />
      </Container>
    </>
  );
}
