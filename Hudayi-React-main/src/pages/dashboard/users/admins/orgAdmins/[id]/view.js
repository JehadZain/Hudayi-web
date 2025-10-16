// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect,useCallback } from 'react';
import { Tab, Card, Tabs , Box,Container,  } from '@mui/material';

import { get } from '../../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../../locales';

import DashboardLayout from '../../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../../components/settings';
import Iconify from '../../../../../../components/iconify';
import CustomBreadcrumbs from '../../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import {
  Profile,
  ProfileCover,
  
 
} from '../../../../../../sections/profile';
import ProfileAbout from '../../../../../../sections/profile/home/ProfileAbout'
import {
  _userAbout,
  
} from '../../../../../../_mock/arrays';
import { useSnackbar } from 'notistack';

View_orgAdmin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_orgAdmin() {
  const { translate } = useLocales();
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const [currentTab, setCurrentTab] = useState('profile');
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();

  const {
    query: { id },
  } = useRouter();
  const getorgAdmin = useCallback(async () => {
    const orgAdmin = await get('organization/admins', id, enqueueSnackbar);
    setData(orgAdmin.data);
  }, [id]);
  
  useEffect(() => {
    getorgAdmin();
  }, [getorgAdmin]);

    const columns = [
  
  
    
    {
      field: 'organization',
      headerName: translate('org_admins.organization'),
    },
    {
      field: 'name',
      headerName: translate('org_admins.name'),
    },

    {
      field: 'first_name',
      headerName: translate('org_admins.first_name'),
    },

    {
      field: 'last_name',
      headerName: translate('org_admins.last_name'),
    },
    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
     
    },
  ];
  const TABS = [

    {
      value: 'profile',
      label:  translate('students.information'),
      icon: <Iconify icon="noto:information" />,
      component: <ProfileAbout
      organization_id={data?.organization_id}
      id={data?.id}
      admin_id={data?.admin_id}
      organization ={data?.organization?.name}
      first_name={data?.admin?.user?.first_name}
      last_name={data?.admin?.user?.last_name}
      
    />
    },
  ]
  return (
    <>
      <Head>
        <title>
          {translate('org_admins.org_admins')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('org_admins.org_admins')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('org_admins.org_admins'), href: PATH_DASHBOARD.orgAdmins.root },
            { name: `${data?.admin?.user?.first_name}`, href: PATH_DASHBOARD.orgAdmins.root },
          ]}
          sx={{
            mt: 4,
          
          }}
        />

<Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
         <ProfileCover  cover={_userAbout.cover} image = {data?.admin?.user?.image}  first_name= {data?.admin?.user?.first_name} last_name= {data?.admin?.user?.last_name} />

         

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            
            {TABS.map((tab) => (
              <Tab  key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>

          
        </Card>
        
        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
       
      </Container>
    </>
  );
}
