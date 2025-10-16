// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Container,
  
  IconButton,
  Stack,
  
  Card,
  Tab,
  Tabs,
  Box,
} from '@mui/material';
import PropTypes from 'prop-types';

import SvgColor from '../../../../components/svg-color';

import { profileUser } from '../../../../../public/assets/icons/components/User_icon.png';
import logo from '../../../../../public/logo/logo_single.svg';
import Label from '../../../../components/label';
import { get } from '../../../../utils/functions';
// layouts
import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
import { useAuthContext } from '../../../../auth/useAuthContext';

import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../../components/custom-avatar';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Image from '../../../../components/image';
import {
  _userAbout,
 
} from '../../../../_mock/arrays';
import {
  ProfileCover,

  ProfileNotes,
} from '../../../../sections/profile';
//
import ProfileAbout from '../../../../sections/profile/home/ProfileAbout';
import { useSnackbar } from 'notistack';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

View_student.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_student(note) {
  ProfileNotes.propTypes = {
    note: PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
      date: PropTypes.string,
    }),
  };

  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const { user } = useAuthContext();
  const [tableData, setTableData] = useState([]);

  const { translate } = useLocales();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getstudent = async () => {
      const student = await get('students', id, enqueueSnackbar);
      if (isMounted) {
        setData(student.data);
      }
    };

    getstudent();

    return () => {
      isMounted = false;
    };
  }, [id]);
  const [currentTab, setCurrentTab] = useState('profile');

  const columns = [
    {
      field: 'session_id',
      flex: 2,
      headerName: translate('students.session_id'),
      valueGetter: (params) => params.row.session_id || '-',
    },
    {
      field: 'student_id',
      flex: 2,
      headerName: translate('students.student_id'),
      valueGetter: (params) => params.row.student_id || '-',
    },
    {
      field: 'session_class_room_id',
      flex: 2.5,
      headerName: translate('students.class_room_id'),
      valueGetter: (params) => (params.row.session ? params.row.session.class_room_id || '-' : '-'),
    },
    {
      field: 'session_subject_name',
      flex: 2,
      headerName: translate('students.session_subject_name'),
      valueGetter: (params) => (params.row.session ? params.row.session.subject_name || '-' : '-'),
    },
    {
      field: 'session_name',
      flex: 2,
      headerName: translate('students.session_name'),
      valueGetter: (params) => (params.row.session ? params.row.session.name || '-' : '-'),
    },
    {
      field: 'session_description',
      flex: 2,
      headerName: translate('students.session_desc'),
      valueGetter: (params) => (params.row.session ? params.row.session.description || '-' : '-'),
    },
    {
      field: 'session_date',
      flex: 2,
      headerName: translate('students.date'),
      valueGetter: (params) => (params.row.session ? params.row.session.date || '-' : '-'),
    },
    {
      field: 'session_start_at',
      flex: 2,
      headerName: translate('students.start_at'),
      valueGetter: (params) => (params.row.session ? params.row.session.start_at || '-' : '-'),
    },
    {
      field: 'session_duration',
      flex: 2,
      headerName: translate('students.duration'),
      valueGetter: (params) => (params.row.session ? params.row.session.duration || '-' : '-'),
    },
    {
      field: 'session_place',
      flex: 2,
      headerName: translate('students.place'),
      valueGetter: (params) => (params.row.session ? params.row.session.place || '-' : '-'),
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

  const columnsActivity = [
    {
      field: 'activity_id',
      flex: 2,
      headerName: translate('students.activity_id'),
      valueGetter: (params) => params.row.id || '-',
    },

    {
      field: 'activity_type_name',
      flex: 2,
      headerName: translate('students.activity_type_name'),
      valueGetter: (params) => params.row?.activity?.name || '-',
    },

    {
      field: 'activity_type_place',
      flex: 2,
      headerName: translate('students.activity_type_place'),
      valueGetter: (params) => params.row?.activity?.place || '-',
    },

    {
      field: 'activity_type_cost',
      headerName: translate('students.cost'),
      valueGetter: (params) => params.row?.activity?.cost || '-',
    },

    {
      field: 'activity_activity_type_name',
      flex: 2,
      headerName: translate('students.activity_activity_type_name'),
      valueGetter: (params) => params.row.activity?.activity_type?.name || '-',
    },

    {
      field: 'activity_activity_type_description',
      flex: 2,
      headerName: translate('students.activity_activity_type_description'),
      valueGetter: (params) => params.row.activity?.activity_type?.description || '-',
    },

    {
      field: 'activity_activity_type_goal',
      flex: 2,
      headerName: translate('students.activity_activity_type_goal'),
      valueGetter: (params) => params.row.activity?.activity_type?.goal || '-',
    },
  ];

  const columnsClassRooms = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('students.class_room_id'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('students.class_room_name'),
    },

    {
      field: 'capacity',
      flex: 2,
      headerName: translate('students.class_room_capacity'),
    },

    {
      field: 'image',
      flex: 1,
      headerName: translate('students.image'),
      renderCell: (params) => (
        <img
          src={`${imageLink}/${params.row.image}`}
          alt={params.value}
          width={40}
          height={40}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      ),
    },

    {
      field: 'is_approved',
      flex: 2,
      headerName: translate('students.class_room_is_approved'),
      renderCell: (params) => {
        let label;
        let translationKey;
        let color;

        if (params.value === '1') {
          translationKey = 'students.approved';
          color = 'success';
        } else if (params.value === '0') {
          translationKey = 'students.pending_approval';
          color = 'warning';
        } else {
          label = '';
        }

        if (translationKey && color) {
          label = (
            <Label color={color} sx={{ ml: 1 }}>
              {translate(translationKey)}
            </Label>
          );
        }

        return label;
      },
    },

    {
      field: 'class_room_grade_id',
      flex: 2,
      headerName: translate('students.class_room_grade_id'),
      valueGetter: (params) => params.row.grade?.id || '-',
    },

    {
      field: 'class_room_grade_name',
      flex: 2,
      headerName: translate('students.class_room_grade_name'),
      valueGetter: (params) => params.row.grade?.name || '-',
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton onClick={() => push(PATH_DASHBOARD.classRooms.view(params.row.id))}>
          <Iconify icon="ic:twotone-remove-red-eye" />
        </IconButton>
      ),
    },
  ];

  const columnsNotes = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('students.notes_id'),
    },

    {
      field: 'date',
      flex: 2,
      headerName: translate('students.notes_date'),
    },

    {
      field: 'content',
      flex: 2,
      headerName: translate('students.contes_content'),
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <IconButton onClick={() => push(PATH_DASHBOARD.classRooms.view(params.row.id))}>
          <Iconify icon="ic:twotone-remove-red-eye" />
        </IconButton>
      ),
    },
  ];

  const iconify = (name) => <Iconify icon={name} />;

  const ICONS = {
    id: iconify('mdi:id-card-outline'),
    name: iconify('wpf:name'),
    email: iconify('mdi:email'),
    phone: iconify('ic:outline-phone'),
    birth: iconify('clarity:date-line'),
    location: iconify('mdi:location'),
    status: iconify('fluent:status-12-regular'),
  };
  const TABS = [
    {
      value: 'profile',
      label: 'Profile',
      icon: <Iconify icon="ic:round-account-box" />,
      component: (
        <ProfileAbout
          first_name={data?.user?.first_name}
          last_name={data?.user?.last_name}
          email={data?.user?.email}
          phone={data?.user?.phone}
          father_name={data?.user?.father_name}
          birth_date={data?.user?.birth_date}
          status={data?.user?.status}
        />
      ),
    },
    {
      value: 'الملاحظات',
      label: 'الملاحظات',
      icon: <Iconify icon="eva:heart-fill" />,
      component: <ProfileNotes note={data?.notes || []} columns={columnsNotes} />,
    },
    {
      value: 'friends',
      label: 'Friends',
      icon: <Iconify icon="eva:people-fill" />,
    },
    {
      value: 'gallery',
      label: 'Gallery',
      icon: <Iconify icon="ic:round-perm-media" />,
    },
  ];

  return (
    <>
      <Head>
        <title>
          {translate('students.students')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('students.students')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('students.students'), href: PATH_DASHBOARD.students.root },
            { name: `${data?.user?.username}`, href: PATH_DASHBOARD.students.root },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover name={user?.username} role={_userAbout.role} cover={_userAbout.cover} />

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
        <Stack style={{ height: '20px' }} />
        <h2>{translate('students.student_sessions')} </h2>
        <DataGridCustom data={data?.session_attendances || []} columns={columns} />

        <h2>{translate('students.student_activities')} </h2>
        <DataGridCustom data={data?.activity_participants || []} columns={columnsActivity} />

        <h2>{translate('students.student_class_rooms')} </h2>
        <DataGridCustom data={data?.class_rooms || []} columns={columnsClassRooms} />
      </Container>
    </>
  );
}
