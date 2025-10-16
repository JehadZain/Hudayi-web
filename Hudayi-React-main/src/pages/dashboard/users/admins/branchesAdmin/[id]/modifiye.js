import Head from 'next/head';
import { useState, useEffect,useCallback } from 'react';
import { Container,  } from '@mui/material';
import { useRouter } from 'next/router';

import { get } from '../../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../../locales';
import DashboardLayout from '../../../../../../layouts/dashboard';

import { useSettingsContext } from '../../../../../../components/settings';
import DataGridCustom from '../../../../../../sections/general/data-grid/DataGridCustom';
import CustomBreadcrumbs from '../../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import BrachAdminNewEditForm from '../../../../../../sections/users/BrachAdminNewEditForm';

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const [data, setData] = useState([]);
  const {
    query: { id },
  } = useRouter();

  const getbranchesAdmin = useCallback(async () => {
    const branchesAdmin = await get('branch/admins', id);
    setData(branchesAdmin.data);
  }, [id]);
  
  useEffect(() => {
    getbranchesAdmin();
  }, [getbranchesAdmin]);

  return (
    <>
      <Head>
        <title>{translate('branch_admins.add')} | {translate('hudayi')}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('branch_admins.add')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('branch_admins.branch_admins'), href: PATH_DASHBOARD.branchsAdmin.root },
            { name: translate('branch_admins.add'), href: PATH_DASHBOARD.branchsAdmin.modifiye('new') },
          ]}
        />
        <BrachAdminNewEditForm isEdit={id !== 'new'} currentProduct={data}/>
      </Container>
    </>
  );
}
