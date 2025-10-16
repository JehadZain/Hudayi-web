import Head from 'next/head';
import { Container,  } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect,useCallback } from 'react';

import { get } from '../../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../../locales';
import DashboardLayout from '../../../../../../layouts/dashboard';

import { useSettingsContext } from '../../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../../components/custom-breadcrumbs';
import OrgAdminNewEditForm from '../../../../../../sections/users/OrgAdminNewEditForm';

import { PATH_DASHBOARD } from '../../../../../../routes/paths';
// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const [data, setData] = useState([]);
  const {
    query: { id },
  } = useRouter();
  const getorgAdmin = useCallback(async () => {
    const orgAdmin = await get('organization/admins', id);
    setData(orgAdmin.data);
  }, [id]);
  
  useEffect(() => {
    getorgAdmin();
  }, [getorgAdmin]);
  return (
    <>
      <Head>
        <title> {translate('org_admins.add')} | {translate('hudayi')}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('org_admins.add')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('org_admins.org_admins'), href: PATH_DASHBOARD.orgAdmins.root },
            { name:  translate('org_admins.add'), href: PATH_DASHBOARD.orgAdmins.modifiye('new') },
          ]}
        />
        <OrgAdminNewEditForm isEdit={id !== 'new'} currentProduct={data}/>
      </Container>
    </>
  );
}
