// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Tab, Card, Tabs, Container, Box, IconButton, Stack, Grid } from '@mui/material';
import PropTypes from 'prop-types';

import { get } from '../../../../utils/functions';

import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
import Label from '../../../../components/label';
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { _userAbout } from '../../../../_mock/arrays';
import { ProfileCover } from '../../../../sections/profile';
import { imageLink } from 'src/auth/utils';
import { useSnackbar } from 'notistack';
import { useTheme } from '@emotion/react';
import { AppCurrentDownload } from 'src/sections/analytics';

function StatWidget({ title, stats, translate, theme }) {
  const series = Object.entries(stats).map(([label, value]) => ({ label: translate(label), value }));
  return (
    <AppCurrentDownload
      title={translate(title)}
      chart={{
        colors: [theme.palette.primary.darker, theme.palette.primary.dark, theme.palette.primary.main],
        series: series,
      }}
    />
  );
}

StatWidget.propTypes = {
  title: PropTypes.string.isRequired,
  stats: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

View_classRoom.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

function ProfileAbout({ class_room_id, class_room_name, capacity, translate }) {
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
      {class_room_id && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:id-card-outline" />
            <strong style={{ marginRight: '5px' }}>{translate('classRooms.classRoomId')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{class_room_id}</p>
          </div>
        </div>
      )}

      {class_room_name && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="icon-park:classroom" />
            <strong style={{ marginRight: '5px' }}>{translate('classRooms.name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{class_room_name}</p>
          </div>
        </div>
      )}

      {capacity && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="grommet-icons:capacity" />
            <strong style={{ marginRight: '5px' }}>{translate('classRooms.capacity')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{capacity}</p>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileAbout.propTypes = {
  class_room_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  class_room_name: PropTypes.string,
  capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  translate: PropTypes.func.isRequired,
};

// ----------------------------------------------------------------------

export default function View_classRoom() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const { translate } = useLocales();
  const [statisticsWidgets, setStatisticsWidgets] = useState([]);
  const theme = useTheme();
  const { push } = useRouter();
  const [currentTab, setCurrentTab] = useState('profile');
  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };
  // use top-level StatWidget component instead of creating component inside render

  function formatTimeElapsed(updatedAt) {
    const now = new Date();
    const updatedAtDate = new Date(updatedAt);
    const elapsedMilliseconds = now - updatedAtDate;

    // Convert milliseconds to weeks, months, days, or years
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30);
    const elapsedYears = Math.floor(elapsedDays / 365);

    if (elapsedYears > 0) {
      return `${elapsedYears} ${translate('students.year', { count: elapsedYears })} ${translate(
        'time.ago'
      )}`;
    }
    if (elapsedMonths > 0) {
      return `${elapsedMonths} ${translate('students.month', { count: elapsedMonths })} ${translate(
        'time.ago'
      )}`;
    }
    if (elapsedDays > 0) {
      return `${elapsedDays} ${translate('students.days_ago')}`;
    }
    return translate('students.less_than_a_day_ago');
  }
  const {
    query: { id },
  } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    let isMounted = true;

    const getClassRoom = async () => {
      const classRoom = await get('class-room', id, enqueueSnackbar);
      const classRoomData = classRoom?.data;
      if (isMounted) {
        setData(classRoom.data);
        const statisticsWidgetsData = [
          <StatWidget
            key="approvedAndPending"
            title="students.approvedAndPendingStudents"
            stats={{
              'students.approvedStudents': classRoomData?.statistics.find((s) => s.name === 'Approved Students')?.count || 0,
              'students.pendingStudents': classRoomData?.statistics.find((s) => s.name === 'Pending Students')?.count || 0,
            }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="quizzes"
            title="students.quizzes"
            stats={{
              'students.faceToFaceQuiz': classRoomData?.statistics.find((s) => s.name === "Face-to-Face Quiz")?.count || 0,
              'students.absenceQuiz': classRoomData?.statistics.find((s) => s.name === 'Absence Quiz')?.count || 0,
              'students.correctArabicReadingQuiz': classRoomData?.statistics.find((s) => s.name === 'Correct Arabic Reading Quiz')?.count || 0,
            }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="sessions"
            title="students.sessions"
            stats={{ 'students.sessions': classRoomData?.statistics.find((s) => s.name === 'Sessions')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="quizzes2"
            title="students.quizzes"
            stats={{ 'students.quizzes': classRoomData?.statistics.find((s) => s.name === 'Quizzes')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="activities"
            title="students.activities"
            stats={{ 'students.activities': classRoomData?.statistics.find((s) => s.name === 'Activities')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="books"
            title="students.books"
            stats={{ 'students.books': classRoomData?.statistics.find((s) => s.name === 'Books')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="interviews"
            title="students.interviews"
            stats={{ 'students.interviews': classRoomData?.statistics.find((s) => s.name === 'Interviews')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
        ];
                setStatisticsWidgets(statisticsWidgetsData);
      }
    };

    getClassRoom();

    return () => {
      isMounted = false;
    };
  }, [id]);
  const Teacherscolumns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('classRooms.teacher_id'),
      valueGetter: (params) => params.row?.teacher?.id || '-',
    },

    {
      field: 'teacher_user_full_name',
      flex: 2,
      headerName: translate('students.teacher_full_name'),
      valueGetter: (params) => {
        const { teacher } = params.row;
        return `${teacher?.user?.first_name} ${teacher?.user?.last_name}`;
      },
    },

    {
      field: 'user_gender',
      flex: 2,
      headerName: translate('classRooms.user_gender'),
      valueGetter: (params) => (params.row.teacher ? params.row.teacher.user.gender || '-' : '-'),
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('students.image'),
      renderCell: (params) => {
        const { user } = params.row;
        let avatarSrc;

        if (params.row?.teacher?.user?.image) {
          avatarSrc = `${imageLink}/${params.row?.teacher?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.first_name}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify
                icon={ICONS.avatarman}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
          </>
        );
      },
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
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.users.teacherView(params.row.teacher.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>

          {/* <IconButton
            onClick={() => push(PATH_DASHBOARD.users.teacherModifiye(params.row.teacher.id))}
          >
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];
  const Studentscolumns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('classRooms.student_id'),
      valueGetter: (params) => params.row?.student?.id || '-',
    },

    {
      field: 'student_user_full_name',
      flex: 2,
      headerName: translate('students.student_full_name'),
      valueGetter: (params) => {
        const { student } = params.row;
        return `${student?.user?.first_name} ${student?.user?.last_name}`;
      },
    },

    {
      field: 'student_is_orphan',
      flex: 2,
      headerName: translate('students.is_orphan'),
      valueGetter: (params) =>
        params.row.student
          ? (params.row.student.is_orphan === 1
              ? translate('students.yes')
              : translate('students.no')) || '-'
          : '-',
    },

    {
      field: 'user_gender',
      flex: 2,
      headerName: translate('classRooms.user_gender'),
      valueGetter: (params) => (params.row.student ? params.row.student?.user?.gender || '-' : '-'),
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('students.image'),
      renderCell: (params) => {
        const { student } = params.row;
        let avatarSrc;

        if (student?.user?.image) {
          avatarSrc = `${imageLink}/${student?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={student?.first_name}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify
                icon={ICONS.avatarman}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
          </>
        );
      },
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
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.users.studentView(params.row.student.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton
            onClick={() => push(PATH_DASHBOARD.users.studentModifiye(params.row.student.id))}
          >
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  const SessionColumns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('sessions.sessionId'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('sessions.name'),
    },

    {
      field: 'date',
      flex: 2,
      headerName: translate('sessions.date'),
    },

    {
      field: 'duration',
      flex: 2,
      headerName: translate('sessions.duration'),
    },

    {
      field: 'subject_name',
      flex: 2,
      headerName: translate('sessions.subject_name'),
    },

    {
      field: 'place',
      flex: 2,
      headerName: translate('sessions.place'),
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
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.sessions.view(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.sessions.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  const ActivitiesColumns = [
    {
      field: 'id',
      flex: 2.5,
      headerName: translate('students.activity_id'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('students.name'),
    },

    {
      field: 'place',
      flex: 2,
      headerName: translate('students.place'),
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('students.image'),
      renderCell: (params) => {
        const { image } = params.row;
        let avatarSrc;

        if (image) {
          avatarSrc = `${imageLink}/${image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={image?.first_name}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify
                icon={ICONS.avatarman}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
          </>
        );
      },
    },

    {
      field: 'activity_type_goal',
      flex: 2,
      headerName: translate('students.activity_activity_type_goal'),
      valueGetter: (params) => params.row?.activity_type?.goal || '-',
    },

    {
      field: 'teacher_user_full_name',
      flex: 4,
      headerName: translate('students.teacher_full_name'),
      valueGetter: (params) => {
        const { teacher } = params.row;
        return `${teacher?.user?.first_name} ${teacher?.user?.last_name}`;
      },
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
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.classRoomActivities.view(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.activities.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  // ...existing code...
  const TABS = [
    {
      value: 'profile',
      label: translate('students.information'),
      icon: <Iconify icon="noto:information" />,
      component: (
        <div style={{ position: 'relative' }}>
          {/* <Label
            color="default"
            style={{
              position: 'absolute',
              left: '10px',
              top: '10px',
              zIndex: '9999999999',
              borderRadius: '30px',
              padding: '15px',
            }}
            onClick={() => push(PATH_DASHBOARD.classRooms.modifiye(data?.id))}
          >
            <span style={{ cursor: 'pointer', fontSize: '15px' }}>{translate('edit')} </span>
          </Label> */}

          <ProfileAbout
            class_room_id={data?.id}
            class_room_name={data?.name}
            capacity={data?.capacity}
            translate={translate}
          />
        </div>
      ),
    },

    {
      value: translate('sessions.sessions'),
      label: translate('sessions.sessions'),
      icon: <Iconify icon="simple-icons:sessionize" />,
      component: <DataGridCustom data={data?.sessions || []} columns={SessionColumns} />,
    },

    {
      value: translate('classRooms.class_Teachers'),
      label: translate('classRooms.class_Teachers'),
      icon: <Iconify icon="noto-v1:man-teacher" />,
      component: (
        <DataGridCustom data={data?.class_room_teachers || []} columns={Teacherscolumns} />
      ),
    },

    {
      value: translate('classRooms.class_students'),
      label: translate('classRooms.class_students'),
      icon: <Iconify icon="fluent-emoji-flat:student-light" />,
      component: (
        <DataGridCustom data={data?.class_room_students || []} columns={Studentscolumns} />
      ),
    },

    {
      value: translate('students.activities'),
      label: translate('students.activities'),
      icon: <Iconify icon="skill-icons:activitypub-light" />,
      component: <DataGridCustom data={data?.activities || []} columns={ActivitiesColumns} />,
    },
     {
      value: translate('students.statistics'),
      label: translate('students.statistics'),
      icon: <Iconify icon="fa6-solid:statistics" />,
      component: (
        <Grid container spacing={3}>
          {statisticsWidgets.map((widget, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              {widget}
            </Grid>
          ))}
        </Grid>
      ),
    },
  ];
  return (
    <>
      <Head>
        <title>
          {translate('classRooms.classRooms')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('classRooms.classRooms')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('classRooms.classRooms'), href: PATH_DASHBOARD.classRooms.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.classRooms.root },
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
          <ProfileCover
            cover="/assets/logo/cover.jfif"
            image={data?.image ? data.image : '/assets/logo/classRoomImage.jpg'}
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
