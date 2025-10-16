// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect,useCallback  } from 'react';
import { Tab, Card, Tabs , Box,Container } from '@mui/material';

import { get } from '../../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../../locales';

import DashboardLayout from '../../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../../routes/paths';
import Iconify from '../../../../../../components/iconify';

import {
  Profile,
  ProfileCover,
 
 
} from '../../../../../../sections/profile';
import ProfileAbout from '../../../../../../sections/profile/home/ProfileAbout'
import {
  _userAbout,
 
} from '../../../../../../_mock/arrays';
import { useSnackbar } from 'notistack';

View_propertyAdmin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_propertyAdmin() {
  const { translate } = useLocales();
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const [currentTab, setCurrentTab] = useState('profile');
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();

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
  const columns = [
   
    
    {
      field: 'id',
      headerName: translate('property_admins.branch_id'),
    },
    {
      field: 'name',
      headerName: translate('property_admins.branch_name'),
    },

    {
      field: 'first_name',
      headerName: translate('property_admins.first_name'),
    },

    {
      field: 'last_name',
      headerName: translate('property_admins.last_name'),
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
      id={data?.id}
      admin_id={data?.admin_id}
      property_name={data?.property?.name}
      first_name={data?.admin?.user?.first_name}
      last_name={data?.admin?.user?.last_name}
    />
    },
  ]
  return (
    <>
      <Head>
        <title>
          {translate('property_admins.property_admins')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('property_admins.property_admins')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('property_admins.property_admins'), href: PATH_DASHBOARD.branchsAdmin.root },
            { name: `${data?.admin?.user?.first_name}`, href: PATH_DASHBOARD.branchsAdmin.root },
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
