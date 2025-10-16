import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { Tab, Card, Tabs, Container, Box, IconButton, Stack, Grid, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import DataGridCustom from '../../../../../sections/general/data-grid/DataGridCustom';

import { PATH_DASHBOARD } from '../../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../../auth/useAuthContext';
import Label from '../../../../../components/label';

// _mock_

// layouts
import DashboardLayout from '../../../../../layouts/dashboard';
// components
import Iconify from '../../../../../components/iconify';
import { AppCurrentDownload } from 'src/sections/analytics';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../../components/settings';
// sections
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileFollowers,
} from '../../../../../sections/profile';
import { useLocales } from '../../../../../locales';
import { get } from '../../../../../utils/functions';
import { useSnackbar } from 'notistack';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

function ProfileAbout({ studentId, first_name, last_name, email, phone, father_name, mother_name, blood_type, username, current_address, is_has_disease, disease_name, birth_place, is_has_treatment, treatment_name, note, birth_date, status, identity_number, gender, translate }) {
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
      {first_name && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="openmoji:european-name-badge" />
            <strong style={{ marginRight: '5px' }}>{translate('teachers.name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{first_name} {last_name}</p>
          </div>
        </div>
      )}
      {/* other fields rendered similarly... */}
    </div>
  );
}

ProfileAbout.propTypes = {
  studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  father_name: PropTypes.string,
  mother_name: PropTypes.string,
  blood_type: PropTypes.string,
  username: PropTypes.string,
  current_address: PropTypes.string,
  is_has_disease: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disease_name: PropTypes.string,
  birth_place: PropTypes.string,
  is_has_treatment: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  treatment_name: PropTypes.string,
  note: PropTypes.string,
  birth_date: PropTypes.string,
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  identity_number: PropTypes.string,
  gender: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

UserProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [statisticsWidgets, setStatisticsWidgets] = useState([]);
  const { push } = useRouter();
  const { translate } = useLocales();
  const [currentTab, setCurrentTab] = useState('profile');
  const { enqueueSnackbar } = useSnackbar();
  const createStatWidget = (title, stats) => {
  const series = Object.entries(stats).map(([label, value]) => ({ 
    label: translate(label),
    value 
  }));
    return (
      <AppCurrentDownload
        title={translate(title)}
        chart={{
          colors: [theme.palette.primary.darker,theme.palette.primary.dark, theme.palette.primary.main],
          series: series,
        }}
      />
    );
  };
  const ICONS = {
    building: 'fxemoji:school',
  };
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getstudent = async () => {
      const student = await get('students', id, enqueueSnackbar);
      const studentData = student.data;
      if (isMounted) {
        setData(student.data);

        const statisticsWidgetsData = [
          createStatWidget('students.sessionsAndAttendance', {
            "students.unattendedSessions": studentData?.statistics.find(s => s.name === "Unattended Sessions")?.count || 0,
            "students.sessions": studentData?.statistics.find(s => s.name === "Sessions")?.count || 0,
          }),
          createStatWidget('students.activitiesAndParticipation', {
            "students.unattendedActivities": studentData?.statistics.find(s => s.name === "Unattended Activities")?.count || 0,
            "students.activities": studentData?.statistics.find(s => s.name === "Activities")?.count || 0
          }),
          createStatWidget('students.quizTypes', {
            "students.faceToFaceQuiz": studentData?.statistics.find(s => s.name === "Face-to-Face Quiz")?.count || 0,
            "students.correctArabicReadingQuiz": studentData?.statistics.find(s => s.name === "Correct Arabic Reading Quiz")?.count || 0
          }),
          createStatWidget('students.otherAssessments', {
            "students.absenceQuiz": studentData?.statistics.find(s => s.name === "Absence Quiz")?.count || 0,
            "students.quizzes": studentData?.statistics.find(s => s.name === "Quizzes")?.count || 0,
          }),
          createStatWidget('students.learningMaterials', {
            "students.books": studentData?.statistics.find(s => s.name === "Books")?.count || 0,
            "students.personalInterviews": studentData?.statistics.find(s => s.name === "Personal Interviews")?.count || 0
          })
        ];
                setStatisticsWidgets(statisticsWidgetsData);
      }
    };

    getstudent();
    
    return () => {
      isMounted = false;
    };
  }, [id]);
  const columnsSession = [
    {
      field: 'session_id',
      flex: 2,
      headerName: translate('students.session_id'),
      valueGetter: (params) => params.row.session_id || '-',
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
      field: 'session_date',
      flex: 2,
      headerName: translate('students.date'),
      valueGetter: (params) => {
        const dateValue = params.row.session ? params.row.session.date || '-' : '-';
        return new Date(dateValue).toLocaleString();
      },
    },
    {
      field: 'session_start_at',
      flex: 2,
      headerName: translate('students.start_at'),
      valueGetter: (params) => {
        const startAtValue = params.row.session ? params.row.session.start_at || '-' : '-';
        return new Date(startAtValue).toLocaleString();
      },
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
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.sessions.view(params.row.session.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.sessions.modifiye(params.row.session.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
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
          <IconButton
            onClick={() => push(PATH_DASHBOARD.activities.activityDetails(params.row.activity.id))}
          >
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton
            onClick={() => push(PATH_DASHBOARD.activities.modifiye(params.row.activity.id))}
          >
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
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
      flex: 2,
      headerName: translate('students.image'),
      renderCell: (paramsCell) => {
        let avatarSrc;

        if (paramsCell.row?.image) {
          avatarSrc = `${imageLink}/${paramsCell.row?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={paramsCell.row?.image}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify
                icon={ICONS.building}
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
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.classRooms.view(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>

          {/* <IconButton onClick={() => push(PATH_DASHBOARD.classRooms.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  const columnsInterviews = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('students.interview_id'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('students.interview_name'),
    },

    {
      field: 'event_place',
      flex: 2,
      headerName: translate('students.interview_place'),
    },

    {
      field: 'goal',
      flex: 2,
      headerName: translate('students.interview_goal'),
    },

    {
      field: 'comment',
      flex: 2,
      headerName: translate('students.comment'),
    },

    {
      field: 'type',
      flex: 2,
      headerName: translate('students.interview_type'),
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('students.image'),
      renderCell: (params) => {
        const { user } = params.row;
        let avatarSrc;

        if (user?.image) {
          avatarSrc = `${imageLink}/${user?.image}`;
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
              <>
                <img
                  width={40}
                  alt=""
                  height={40}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                  src="/assets/logo/session.jfif"
                />
              </>
            )}
          </>
        );
      },
    },

    {
      field: 'score',
      flex: 2,
      headerName: translate('students.score'),
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
          <IconButton
            onClick={() => push(PATH_DASHBOARD.interviews.interviewDetails(params.row.id))}
          >
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.interviews.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  const columnsNotes = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('students.note_id'),
    },

    {
      field: 'student_id',
      flex: 2,
      headerName: translate('students.student_id'),
    },

    {
      field: 'date',
      flex: 3,
      headerName: translate('students.interview_date'),
      valueGetter: (params) => {
        const dateValue = params.row.date || '-';
        return new Date(dateValue).toLocaleString();
      },
    },

    {
      field: 'teacher_content',
      flex: 3,
      headerName: translate('notes.teacher_content'),
    },

    {
      field: 'updated_at',
      flex: 2,
      headerName: translate('students.updated_at'),
      valueGetter: (params) => formatTimeElapsed(params.row.updated_at),
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
      field: 'action',
      headerName: ' ',
      align: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.notes.noteDetails(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.notes.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  const columnsQuranQuizzes = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('students.QuranQuizz_id'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('students.QuranQuizz_name'),
    },

    {
      field: 'exam_type',
      flex: 2,
      headerName: translate('students.exam_type'),
    },

    {
      field: 'score',
      flex: 2,
      headerName: translate('students.score'),
    },

    {
      field: 'updated_at',
      flex: 2,
      headerName: translate('students.updated_at'),
      valueGetter: (params) => formatTimeElapsed(params.row.updated_at),
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
      field: 'action',
      headerName: ' ',
      align: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton
            onClick={() => push(PATH_DASHBOARD.quranQuizes.quranQuizeDetails(params.row.id))}
          >
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.quranQuizes.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  const columnsQuizzes = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('students.Quizz_id'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('students.Quizz_name'),
    },

    {
      field: 'quiz_type',
      flex: 2,
      headerName: translate('students.quiz_type'),
      renderCell: (params) => {
        let label;
        if (params.value === 'مناهج') {
          label = (
            <Label color="warning" sx={{ ml: 1 }}>
              {params.value}
            </Label>
          );
        } else if (params.value === null) {
          label = '';
        } else {
          label = (
            <Label color="info" sx={{ ml: 1 }}>
              {params.value}
            </Label>
          );
        }
        return <div style={{ display: 'flex', alignItems: 'center' }}>{label}</div>;
      },
    },

    {
      field: 'score',
      flex: 2,
      headerName: translate('students.score'),
    },

    {
      field: 'updated_at',
      flex: 2,
      headerName: translate('students.updated_at'),
      valueGetter: (params) => formatTimeElapsed(params.row.updated_at),
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
      field: 'action',
      headerName: ' ',
      align: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,

      renderCell: (params) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.quizes.quizDetails(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.quizes.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];
  const iconify = (name) => <Iconify icon={name} />;
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
              zIndex: '999999',
              borderRadius: '30px',
              padding: '15px',
            }}
            onClick={() => push(PATH_DASHBOARD.users.studentModifiye(data?.id))}
          >
            <span style={{ cursor: 'pointer', fontSize: '15px' }}>{translate('edit')} </span>
          </Label> */}

          <ProfileAbout
            studentId={data?.id}
            first_name={data?.user?.first_name}
            last_name={data?.user?.last_name}
            email={data?.user?.email}
            phone={data?.user?.phone}
            father_name={data?.user?.father_name}
            mother_name={data?.user?.mother_name}
            blood_type={data?.user?.blood_type}
            username={data?.user?.username}
            current_address={data?.user?.current_address}
            is_has_disease={data?.user?.is_has_disease}
            disease_name={data?.user?.disease_name}
            birth_place={data?.user?.birth_place}
            is_has_treatment={data?.user?.is_has_treatment}
            treatment_name={data?.user?.treatment_name}
            note={data?.user?.note}
            birth_date={
              data?.user?.birth_date ? format(new Date(data?.user?.birth_date), 'yyyy-MM-dd') : ''
            }
            status={data?.user?.status}
            identity_number={data?.user?.identity_number}
            gender={data?.user?.gender}
          />
        </div>
      ),
    },

    {
      value: translate('students.activity'),
      label: translate('students.activity'),
      icon: <Iconify icon="skill-icons:activitypub-light" />,
      component: (
        <DataGridCustom
          data={data?.activity_participants || []}
          columns={columnsActivity}
          link={PATH_DASHBOARD.activities.modifiye('new')}
        />
      ),
    },

    {
      value: translate('students.classRooms'),
      label: translate('students.classRooms'),
      icon: <Iconify icon="icon-park:classroom" />,
      component: (
        <DataGridCustom
          data={data?.class_rooms || []}
          columns={columnsClassRooms}
          link={PATH_DASHBOARD.classRooms.modifiye('new')}
        />
      ),
    },

    {
      value: translate('students.sessions'),
      label: translate('students.sessions'),
      icon: <Iconify icon="material-symbols:play-lesson-outline" />,
      component: (
        <DataGridCustom
          data={data?.session_attendances || []}
          columns={columnsSession}
          link={PATH_DASHBOARD.sessions.modifiye('new')}
        />
      ),
    },

    {
      value: translate('students.interviews'),
      label: translate('students.interviews'),
      icon: <Iconify icon="openmoji:interview" />,
      component: (
        <DataGridCustom
          data={data?.interviews || []}
          columns={columnsInterviews}
          link={PATH_DASHBOARD.interviews.modifiye('new')}
        />
      ),
    },
    {
      value: translate('students.notes'),
      label: translate('students.notes'),
      icon: <Iconify icon="fxemoji:note" />,
      component: (
        <DataGridCustom
          data={data?.notes || []}
          columns={columnsNotes}
          link={PATH_DASHBOARD.notes.modifiye('new')}
        />
      ),
    },
    {
      value: translate('students.QuranQuizzes'),
      label: translate('students.QuranQuizzes'),
      icon: <Iconify icon="fa6-solid:child-reaching" />,
      component: (
        <DataGridCustom
          data={data?.quran_quizzes || []}
          columns={columnsQuranQuizzes}
          link={PATH_DASHBOARD.quranQuizes.modifiye('new')}
        />
      ),
    },
    {
      value: translate('students.quizzes'),
      label: translate('students.quizzes'),
      icon: <Iconify icon="healthicons:i-exam-multiple-choice-negative" />,
      component: (
        <DataGridCustom
          data={data?.quizzes || []}
          columns={columnsQuizzes}
          link={PATH_DASHBOARD.quizes.modifiye('new')}
        />
      ),
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
  function formatTimeElapsed(updatedAt) {
    const now = new Date();
    const updatedAtDate = new Date(updatedAt);
    const elapsedMilliseconds = now - updatedAtDate;

    // Convert milliseconds to weeks, months, days, hours, and minutes
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30);
    const elapsedYears = Math.floor(elapsedDays / 365);

    if (elapsedYears > 0) {
      return `${elapsedYears} ${translate('students.year', { count: elapsedYears })}
      `;
    }
    if (elapsedMonths > 0) {
      return `${elapsedMonths} ${translate('students.month', { count: elapsedMonths })} 
      `;
    }
    if (elapsedDays > 0) {
      return `${elapsedDays} ${translate('students.days_ago')}`;
    }
    if (elapsedHours > 0) {
      return `${elapsedHours} ${translate('students.hours_ago')}`;
    }
    if (elapsedMinutes > 0) {
      return `${elapsedMinutes} ${translate('students.minutes_ago')}`;
    }

    return translate('students.less_than_a_minute_ago');
  }

  const getUsernameTranslation = (username) => {
    switch (username) {
      case 'org_admin':
        return translate('admins.org_admin_translation'); // Translate to 'مدير المنظمة'
      case 'branch_admin':
        return translate('admins.branch_admin_translation'); // Translate to 'مدير المركز'
      case 'property_admin':
        return translate('admins.property_admin_translation'); // Translate to 'مدير المنطقة'
      case 'student':
        return translate('طالب'); // Translate to 'طالب'
      case 'teacher':
        return translate('أستاذ'); // Translate to 'أستاذ'
      default:
        return username;
    }
  };
  return (
    <>
      <Head>
        <title> {translate('students.students')}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('students.profile')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('students.students'), href: PATH_DASHBOARD.users.studentRoot },
            { name: data?.user?.first_name },
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
            image={data?.user?.image}
            first_name={data?.user?.first_name}
            last_name={data?.user?.last_name}
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
