// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container, IconButton, Card, Tabs, Tab, Box,Stack  } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import Label from '../../../../components/label';

import { get } from '../../../../utils/functions';
// layouts
import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../../components/custom-avatar';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { ProfileCover } from '../../../../sections/profile';
import { _userAbout } from '../../../../_mock/arrays';
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

View_student.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

function ProfileAbout({ sessionId, sessionName, description, date, start_at, duration, subject_name, place, type, teacherName, translate }) {
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
      {sessionId && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:id-card-outline" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.sessionId')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{sessionId}</p>
          </div>
        </div>
      )}

      {sessionName && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="simple-icons:sessionize" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{sessionName}</p>
          </div>
        </div>
      )}

      {teacherName && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="wpf:name" />
            <strong style={{ marginRight: '5px' }}>{translate('teachers.teacher_full_name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{teacherName}</p>
          </div>
        </div>
      )}

      {date && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="clarity:date-line" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.date')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{date}</p>
          </div>
        </div>
      )}

      {start_at && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="ri:time-line" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.start_at')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{start_at}</p>
          </div>
        </div>
      )}

      {duration && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="game-icons:duration" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.duration')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{duration}</p>
          </div>
        </div>
      )}

      {subject_name && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="material-symbols:subject" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.subject_name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{subject_name}</p>
          </div>
        </div>
      )}

      {place && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="ep:place" />
            <strong style={{ marginRight: '5px' }}>{translate('sessions.place')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{place}</p>
          </div>
        </div>
      )}

      {description && (
        <div style={{ flexBasis: '70%', padding: '10px' }}>
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
  sessionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sessionName: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.string,
  start_at: PropTypes.string,
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subject_name: PropTypes.string,
  place: PropTypes.string,
  type: PropTypes.string,
  teacherName: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

// ----------------------------------------------------------------------

export default function View_student() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [currentTab, setCurrentTab] = useState('profile');
const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { push } = useRouter();

  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getsession = async () => {
      const session = await get('sessions', id, enqueueSnackbar);
      if (isMounted) {
        setData(session.data);
      }
    };

    getsession();

    return () => {
      isMounted = false;
    };
  }, [id]);
  const columns = [
    {
      field: 'student_id',
      flex: 1,
      headerName: translate('students.studentId'),
      valueGetter: (params) => params.row.student?.id,
    },

    {
      field: 'student_user_full_name',
      flex: 1,
      headerName: translate('students.student_full_name'),
      valueGetter: (params) =>
        `${params.row.student?.user?.first_name} ${params.row.student?.user?.last_name}`,
    },

    {
      field: 'gender',
      flex: 1,
      headerName: translate('sessions.student_user_gender'),

      valueGetter: (params) => params.row.student.user.gender,

      valueFormatter: (paramsFormatter) => {
        if (paramsFormatter.value === '0') {
          return translate('students.gender_male');
        }
        if (paramsFormatter.value === '1') {
          return translate('students.gender_female');
        }
        return paramsFormatter.value;
      },
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction='row'>
        <IconButton onClick={() => push(PATH_DASHBOARD.users.studentView(params.row.student?.id))}>
          <Iconify icon="ic:twotone-remove-red-eye" />
        </IconButton>
        {/* <IconButton onClick={() => push(PATH_DASHBOARD.sessions.modifiye(params.row?.session_id))}>
          <Iconify icon="material-symbols:edit" />
        </IconButton> */}
        </Stack>
      ),
    },
  ];
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date)) {
        return '-';
      }
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };
  
  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      if (Number.isNaN(date)) {
        return '';
      }
      return date.toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const TABS = [
    {
      value: 'profile',
      label: translate('students.information'),
      icon: <Iconify icon="noto:information" />,
      component:
      
     

      (
        <div style={{'position':'relative'}}>
        {/* <Label color='default' style={{'position':'absolute', 'left':'10px', 'top':'10px', 'zIndex':'9999999999', borderRadius:'30px', 'padding':'15px'}}  onClick={() => push(PATH_DASHBOARD.sessions.modifiye(data?.id))}>
     <span style={{'cursor':'pointer', 'fontSize':'15px',}}>{translate('edit')} </span>
    </Label> */}
        <ProfileAbout
  sessionId={data?.id}
  sessionName={data?.name}
  description={data?.description}
  date={formatDate(data?.date)}
  start_at={formatTime(data?.start_at)}
  duration={data?.duration}
  subject_name={data?.subject_name}
  place={data?.place}
  type={data?.type}
  teacherName={`${data?.teacher?.user?.first_name} ${data?.teacher?.user?.last_name}`}
 
/>
</div>

      ),
     
    },

    {
      value: translate('sessions.attainadances'),
      label: translate('sessions.attainadances'),
      icon: <Iconify icon="icon-park:classroom" />,
      component: <DataGridCustom data={data?.session_attendances || []} columns={columns} />,
    },
  ];
  return (
    <>
      <Head>
        <title>
          {translate('sessions.sessions')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('sessions.sessions')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('sessions.sessions'), href: PATH_DASHBOARD.sessions.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.sessions.root },
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
          <ProfileCover        cover='/assets/logo/cover.jfif'
            image ='/assets/logo/session.jfif'
            first_name={data?.name}
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
