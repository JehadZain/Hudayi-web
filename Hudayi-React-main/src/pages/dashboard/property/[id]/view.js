import Head from 'next/head';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
//
import { Container, Tab, Card, Tabs, Box, IconButton, Button, Stack, Grid } from '@mui/material';
import PropTypes from 'prop-types';

import { get } from '../../../../utils/functions';
// layouts
import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Label from '../../../../components/label';

import { ProfileCover } from '../../../../sections/profile';
import { _userAbout } from '../../../../_mock/arrays';
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

function ProfileAbout({
  property_id,
  name,
  capacity,
  branch_id,
  property_type,
  description,
  translate,
}) {
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
      {property_id && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:id-card-outline" />
            <strong style={{ marginRight: '5px' }}>{translate('properties.propertyId')}</strong>:
            <p style={{ marginRight: '5px' }}>{property_id}</p>
          </div>
        </div>
      )}

      {name && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="openmoji:european-name-badge" />
            <strong style={{ marginRight: '5px' }}>{translate('properties.name')}</strong>:
            <p style={{ marginRight: '5px' }}>{name}</p>
          </div>
        </div>
      )}

      {branch_id && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="carbon:branch" />
            <strong style={{ marginRight: '5px' }}>{translate('properties.branch_id')}</strong>:
            <p style={{ marginRight: '5px' }}>{branch_id}</p>
          </div>
        </div>
      )}

      {capacity && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="grommet-icons:capacity" />
            <strong style={{ marginRight: '5px' }}>{translate('properties.capacity')}</strong>:
            <p style={{ marginRight: '5px' }}>{capacity}</p>
          </div>
        </div>
      )}

      {property_type && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="material-symbols:merge-type" />
            <strong style={{ marginRight: '5px' }}>{translate('properties.property_type')}</strong>:
            <p style={{ marginRight: '5px' }}>{property_type}</p>
          </div>
        </div>
      )}

      {description && (
        <div style={{ flexBasis: '70%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="material-symbols:description" />
            <strong style={{ marginRight: '5px' }}>{translate('properties.description')}</strong>:
            <p style={{ marginRight: '5px' }}>{description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileAbout.propTypes = {
  property_id: PropTypes.string,
  name: PropTypes.string,
  capacity: PropTypes.string,
  branch_id: PropTypes.string,
  property_type: PropTypes.string,
  description: PropTypes.string,
  translate: PropTypes.func,
};

View_property.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_property() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const { translate } = useLocales();
  const { push } = useRouter();
  const [currentTab, setCurrentTab] = useState('profile');
  const [statisticsWidgets, setStatisticsWidgets] = useState([]);
  const theme = useTheme();
  // use top-level StatWidget
const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getProperty = async () => {
      const property = await get('properties', id, enqueueSnackbar);
      const propertyData = property.data;
      if (isMounted) {
        setData(property.data);

         const statisticsWidgetsData = [
          <StatWidget
            key="approvedAndPending"
            title="students.approvedAndPendingStudents"
            stats={{
              'students.approvedStudents': propertyData?.statistics.find((s) => s.name === 'Approved Students')?.count || 0,
              'students.pendingStudents': propertyData?.statistics.find((s) => s.name === 'Pending Students')?.count || 0,
            }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="quizzes"
            title="students.quizzes"
            stats={{
              'students.faceToFaceQuiz': propertyData?.statistics.find((s) => s.name === "Face-to-Face Quiz")?.count || 0,
              'students.absenceQuiz': propertyData?.statistics.find((s) => s.name === 'Absence Quiz')?.count || 0,
              'students.correctArabicReadingQuiz': propertyData?.statistics.find((s) => s.name === 'Correct Arabic Reading Quiz')?.count || 0,
            }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="classrooms"
            title="students.classrooms"
            stats={{ 'students.classrooms': propertyData?.statistics.find((s) => s.name === 'Classrooms')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="teachers"
            title="students.teachers"
            stats={{ 'students.teachers': propertyData?.statistics.find((s) => s.name === 'Teachers')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="activities"
            title="students.activities"
            stats={{ 'students.activities': propertyData?.statistics.find((s) => s.name === 'Activities')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
          <StatWidget
            key="books"
            title="students.books"
            stats={{ 'students.books': propertyData?.statistics.find((s) => s.name === 'Books')?.count || 0 }}
            translate={translate}
            theme={theme}
          />,
        ];
                setStatisticsWidgets(statisticsWidgetsData);
      }
    };

    getProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);
  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('properties.grade_id'),
    },
    {
      field: 'property_id',
      flex: 2,
      headerName: translate('properties.property_id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('properties.grade_name'),
    },
    {
      field: 'description',
      flex: 2,
      headerName: translate('properties.grade_description'),
    },
    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.grades.view(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.grades.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];
  const propertyAdmins = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('properties.grade_id'),
    },

    {
      field: 'property_id',
      flex: 2,
      headerName: translate('properties.property_id'),
    },
    {
      field: 'admin_id',
      flex: 2,
      headerName: translate('properties.admin_id'),
    },
    {
      field: 'teacher_user_full_name',
      flex: 2,
      headerName: translate('properties.admin_full_name'),
      valueGetter: (params) => {
        const { admin } = params.row;
        return `${admin?.user?.first_name} ${admin?.user?.last_name}`;
      },
    },

    {
      field: 'image',
      flex: 1,
      headerName: translate('students.image'),
      renderCell: (paramsCell) => {
        let avatarSrc;

        if (paramsCell.row?.admin?.user?.image) {
          avatarSrc = `${imageLink}/${paramsCell.row?.admin?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={paramsCell.row?.admin?.user?.image}
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
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.propertyAdmin.view(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton
            onClick={() => push(PATH_DASHBOARD.propertyAdmin.modifiye(params.row.admin_id))}
          >
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  function propertyTypeTranslation(type) {
    if (type === 'school' || type === 'مدرسة') {
      return translate('properties.school_translation');
    }
    if (type === 'mosque' || type === 'جامع') {
      return translate('properties.mosque_translation');
    }
    return type;
  }

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
            onClick={() => push(PATH_DASHBOARD.property.modifiye(data?.id))}
          >
            <span style={{ cursor: 'pointer', fontSize: '15px' }}>{translate('edit')} </span>
          </Label> */}

          <ProfileAbout
            property_id={data?.id}
            name={data?.name}
            capacity={data?.capacity}
            branch_id={data?.branch_id}
            property_type={data?.property_type}
            description={data?.description}
            translate={translate}
          />
        </div>
      ),
    },

    {
      value: translate('properties.grades'),
      label: translate('properties.grades'),
      icon: <Iconify icon="ic:outline-grade" />,
      component: (
        <DataGridCustom
          data={data?.grades || []}
          columns={columns}
          link={PATH_DASHBOARD.grades.modifiye('new')}
        />
      ),
    },

    {
      value: translate('properties.propertyAdmins'),
      label: translate('properties.propertyAdmins'),
      icon: <Iconify icon="subway:admin" />,
      component: (
        <DataGridCustom
          data={data?.property_admins || []}
          columns={propertyAdmins}
          link={PATH_DASHBOARD.propertyAdmin.modifiye('new')}
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
  const iconify = (name) => <Iconify icon={name} />;

  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };
  return (
    <>
      <Head>
        <title>
          {translate('properties.properties')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('properties.properties')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('properties.properties'), href: PATH_DASHBOARD.property.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.property.root },
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
            image={data?.image ? data.image : '/assets/logo/property.png'}
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
