// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Tab, Card, Tabs, Box, Container } from '@mui/material';
import { get } from '../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../locales';
import DashboardLayout from '../../../../../layouts/dashboard';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { ProfileCover } from '../../../../../sections/profile';
import { useSnackbar } from 'notistack';

View_admin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default function View_admin() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();

  const [data, setData] = useState({});
  const [currentTab, setCurrentTab] = useState('profile');

  useEffect(() => {
    let isMounted = true;
    const fetchAdmin = async () => {
      const res = await get('admins', id, enqueueSnackbar);
      if (isMounted && res?.data) setData(res.data);
    };
    if (id) fetchAdmin();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const TABS = [
    {
      value: 'profile',
      label: translate('profile.profile'),
      icon: null,
      component: (
        <Card sx={{ p: 3 }}>
          {/* Basic profile about could go here or import a shared ProfileAbout component */}
          <div>{data?.user?.first_name} {data?.user?.last_name}</div>
        </Card>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>{translate('admins.admins')}</title>
      </Head>

      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading={translate('admins.admins')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.users.adminRoot },
            { name: translate('admins.admins'), href: PATH_DASHBOARD.users.adminRoot },
            { name: data?.user?.first_name || '' },
          ]}
          sx={{ mt: 4 }}
        />

        <Card sx={{ mb: 3, height: 280, position: 'relative' }}>
          <ProfileCover
            cover="/assets/logo/cover.jfif"
            image={data?.user?.image}
            first_name={data?.user?.first_name}
            username={data?.user?.username}
          />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}>{tab.component}</Box>)}
      </Container>
    </>
  );
}

View_admin.propTypes = {
  // no props
};

