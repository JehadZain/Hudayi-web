// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Container,
  
  Tab, Card, Tabs , Box,
  IconButton,
 
 
  
  
} from '@mui/material';

import { get } from '../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../locales';
import DashboardLayout from '../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../components/settings';
import DataGridCustom from '../../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../../components/iconify';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import {
 
  ProfileCover,
  
 
} from '../../../../../sections/profile';
import ProfileAbout from '../../../../../sections/profile/home/ProfileAbout'
import {
  _userAbout,
  
  
} from '../../../../../_mock/arrays';
import { useSnackbar } from 'notistack';

View_mosque.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_mosque() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const { translate } = useLocales();
  const { push } = useRouter();
  const [currentTab, setCurrentTab] = useState('profile');
const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getMosque = async () => {
      const mosque = await get('properties', id, enqueueSnackbar);
      if (isMounted) {
        setData(mosque.data);
      }
    };

    getMosque();

    return () => {
      isMounted = false;
    };
  }, [id]);
  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('mosques.grade_id'),
    },

    {
      field: 'property_id',
      flex: 2,
      headerName: translate('mosques.property_id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('mosques.grade_name'),
    },

     

    {
      field: 'description',
      flex: 2,
      headerName: translate('mosques.description'),
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton onClick={() => push(PATH_DASHBOARD.grades.view(params.row.id))}>
          <Iconify icon="ic:twotone-remove-red-eye" />
        </IconButton>
      ),
    },
  ];
  const TABS = [

    {
      value:'profile',
      label:  translate('students.information'),
      icon: <Iconify icon="noto:information" />,
      component: <ProfileAbout
      name={data?.name}
      mosque_id={data?.id}
      id={data?.branch_id}
      
      capacity={data?.capacity}
     
    />
    },

    {
      value: translate('properties.grade'),
      label:  translate('properties.grade'),
      icon: <Iconify icon="ic:outline-grade"/>,
      component:  <DataGridCustom data={data?.grades || []} columns={columns} />
    },
  ]
  return (
    <>
      <Head>
        <title>
          {translate('mosques.mosques')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('mosques.mosques')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('mosques.mosques'), href: PATH_DASHBOARD.mosques.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.mosques.root },
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
          
          <ProfileCover   cover='/assets/logo/cover.jfif' image src={data?.user?.image} first_name= {data?.name} username = {data?.user?.username}/>

         

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
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
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
