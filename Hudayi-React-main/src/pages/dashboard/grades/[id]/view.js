// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Tab,
  Card,
  Tabs,
  Box,
  IconButton,
  Stack,
  TextField,
  InputBase,
  Grid,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { _userAbout } from '../../../../_mock/arrays';

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

function ProfileAbout({ gradename, gradeId, description, property_name }) {
  const { translate } = useLocales();

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
      {gradeId && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:id-card-outline" />
            <strong style={{ marginRight: '5px' }}>{translate('grades.gradesId')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{gradeId}</p>
          </div>
        </div>
      )}

      {gradename && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:building" />
            <strong style={{ marginRight: '5px' }}>{translate('grades.name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{gradename}</p>
          </div>
        </div>
      )}

      {property_name && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="material-symbols:merge-type" />
            <strong style={{ marginRight: '5px' }}>{translate('properties.name')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{property_name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileAbout.propTypes = {
  gradename: PropTypes.string,
  gradeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  property_name: PropTypes.string,
};

View_grades.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_grades() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const { translate } = useLocales();
  const [statisticsWidgets, setStatisticsWidgets] = useState([]);
  const theme = useTheme();
  const { push } = useRouter();
  const [currentTab, setCurrentTab] = useState('profile');
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();

  useEffect(() => {
    let isMounted = true;

    const getGrade = async () => {
      const grade = await get('grades', id, enqueueSnackbar);
      const gradeData = grade?.data;
      if (isMounted) {
        setData(grade.data);
        const statisticsWidgetsData = [
          <StatWidget
            key="approvedAndPending"
            title="students.approvedAndPendingStudents"
            stats={{
              'students.approvedStudents': gradeData?.statistics.find((s) => s.name === 'Approved Students')?.count || 0,
              'students.pendingStudents': gradeData?.statistics.find((s) => s.name === 'Pending Students')?.count || 0,
            }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="quizzes"
            title="students.quizzes"
            stats={{
              'students.faceToFaceQuiz': gradeData?.statistics.find((s) => s.name === 'Face-to-Face Quiz')?.count || 0,
              'students.absenceQuiz': gradeData?.statistics.find((s) => s.name === 'Absence Quiz')?.count || 0,
              'students.correctArabicReadingQuiz': gradeData?.statistics.find((s) => s.name === 'Correct Arabic Reading Quiz')?.count || 0,
            }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="classrooms"
            title="students.classrooms"
            stats={{ 'students.classrooms': gradeData?.statistics.find((s) => s.name === 'Classrooms')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="teachers"
            title="students.teachers"
            stats={{ 'students.teachers': gradeData?.statistics.find((s) => s.name === 'Teachers')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="activities"
            title="students.activities"
            stats={{ 'students.activities': gradeData?.statistics.find((s) => s.name === 'Activities')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="books"
            title="students.books"
            stats={{ 'students.books': gradeData?.statistics.find((s) => s.name === 'Books')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
        ];
        setStatisticsWidgets(statisticsWidgetsData);
      }
    };

    getGrade();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleTabClick = () => {
    setCurrentTab('profile');
  };
  const columns = [
    {
      field: 'grade_id',
      flex: 1,
      headerName: translate('grades.gradesId'),
    },
    {
      field: 'name',
      flex: 1,
      headerName: translate('grades.name'),
    },

    {
      field: 'property_id',
      flex: 1,
      headerName: translate('properties.name'),
      
    },
    {
      field: 'capacity',
      flex: 1,
      headerName: translate('grades.capacity'),
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


  // Use top-level ProfileAbout component defined above
  
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
            onClick={() => push(PATH_DASHBOARD.grades.modifiye(data?.id))}
          >
            <span style={{ cursor: 'pointer', fontSize: '15px' }}>{translate('edit')} </span>
          </Label> */}

          <ProfileAbout gradename={data?.name} gradeId={data?.id} description={data?.description}  property_name={data?.property?.name}/>
        </div>
      ),
    },

    {
      value: translate('grades.class_rooms'),
      label: translate('grades.class_rooms'),
      icon: <Iconify icon="icon-park:classroom" />,
      component: (
        <DataGridCustom
          data={data?.class_rooms || []}
          columns={columns}
          link={PATH_DASHBOARD.classRooms.modifiye('new')}
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

  const ICONS = {
    grade: 'ic:outline-grade',
  };

  return (
    <>
      <Head>
        <title>
          {translate('grades.grades')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('grades.grades')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('grades.grades'), href: PATH_DASHBOARD.grades.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.grades.root },
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
            image="/assets/logo/grade.png"
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
