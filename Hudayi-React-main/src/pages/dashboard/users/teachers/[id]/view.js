// Clean teachers view - single implementation
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { Tab, Card, Tabs, Box, Container } from '@mui/material';
import { useLocales } from '../../../../../locales';
import DashboardLayout from '../../../../../layouts/dashboard';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { ProfileCover } from '../../../../../sections/profile';
import ProfileAbout from '../../../../../sections/profile/home/ProfileAbout';
import { get } from '../../../../../utils/functions';
import { useSnackbar } from 'notistack';

export default function View_teacher() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();

  const [data, setData] = useState(null);
  const [currentTab, setCurrentTab] = useState('profile');

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      const res = await get('teachers', id, enqueueSnackbar);
      if (mounted && res?.data) setData(res.data);
    }
    if (id) fetchData();
    return () => {
      mounted = false;
    };
  }, [id, enqueueSnackbar]);

  if (!data) return null;

  const TABS = [
    {
      value: 'profile',
      label: translate('profile.profile'),
      component: (
        <Card sx={{ p: 3 }}>
          <ProfileAbout
            first_name={data?.user?.first_name}
            last_name={data?.user?.last_name}
            email={data?.user?.email}
            phone={data?.user?.phone}
            father_name={data?.user?.father_name}
            mother_name={data?.user?.mother_name}
            gender={data?.user?.gender}
            birth_date={data?.user?.birth_date}
            status={data?.user?.status}
            translate={translate}
          />
        </Card>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>{translate('teachers.teachers')}</title>
      </Head>

      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading={translate('teachers.teachers')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('teachers.teachers'), href: PATH_DASHBOARD.users.teacherRoot },
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
            onChange={(e, v) => setCurrentTab(v)}
            sx={{ width: 1, bottom: 0, zIndex: 9, position: 'absolute', bgcolor: 'background.paper' }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {TABS.map((tab) => tab.value === currentTab && <Box key={tab.value}>{tab.component}</Box>)}
      </Container>
    </>
  );
}

View_teacher.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
