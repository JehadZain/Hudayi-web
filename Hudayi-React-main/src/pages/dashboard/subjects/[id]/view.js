// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {  Tab, Card, Tabs,Box,Container,  } from '@mui/material';
import PropTypes from 'prop-types';

import Label from '../../../../components/label';

import { get } from '../../../../utils/functions';
// layouts
import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';

import { useSettingsContext } from '../../../../components/settings';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import {
  Profile,
  ProfileCover,
  
 
} from '../../../../sections/profile';
import {
  _userAbout,
 
} from '../../../../_mock/arrays';
import { useSnackbar } from 'notistack';

function ProfileAbout({ subjectId, subject_name, description, translate }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '1px 1px 10px 7px rgba(0,0,0,0.1)',
        padding: '20px',
        width: '100%',
      }}
    >
      {subjectId && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:id-card-outline" />
            <strong style={{ marginRight: '5px' }}>{translate('subjects.subjectId')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{subjectId}</p>
          </div>
        </div>
      )}

      {subject_name && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:building" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.subject_name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{subject_name}</p>
          </div>
        </div>
      )}

      {description && (
        <div style={{ flexBasis: '50%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="material-symbols:description" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.description')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileAbout.propTypes = {
  subjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subject_name: PropTypes.string,
  description: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

View_subject.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_subject() {
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

    const getsubject = async () => {
      const subject = await get('subjects', id, enqueueSnackbar);
      if (isMounted) {
        setData(subject.data);
      }
    };

    getsubject();

    return () => {
      isMounted = false;
    };
  }, [id]);


  const columns = [
    {
      field: 'id',
      flex: 1,
      headerName: translate('subjects.id'),
    },
    {
      field: 'subject_id',
      flex: 1,
      headerName: translate('subjects.subjectsId'),
    },
    {
      field: 'name',
      flex: 1,
      headerName: translate('subjects.name'),
    },
    {
      field: 'capacity',
      flex: 2,
      headerName: translate('subjects.capacity'),
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
  ];


  // Use the top-level ProfileAbout defined above to avoid defining components inside render


  const TABS = [

    {
      value: 'profile',
      label:  translate('students.information'),
      icon: <Iconify icon="noto:information" />,
      component: 
      <div style={{'position':'relative'}}>
      {/* <Label color='default' style={{'position':'absolute', 'left':'10px', 'top':'10px', 'zIndex':'9999999999', borderRadius:'30px', 'padding':'15px'}}  onClick={() => push(PATH_DASHBOARD.subjects.modifiye(data?.id))}>
   <span style={{'cursor':'pointer', 'fontSize':'15px',}}>{translate('edit')} </span>
  </Label> */}
      
      <ProfileAbout
      subjectId={data?.id}
      subject_name={data?.name}
      description={data?.description}
      
    />
    </div>
    },
  ]
  return (
    <>
      <Head>
        <title>
          {translate('subjects.subjects')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('subjects.subjects')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('subjects.subjects'), href: PATH_DASHBOARD.subjects.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.subjects.root },
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
          
          <ProfileCover   cover='/assets/logo/cover.jfif' image ='/assets/logo/book.png' first_name= {data?.name} username = {data?.user?.username}/>

         

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
