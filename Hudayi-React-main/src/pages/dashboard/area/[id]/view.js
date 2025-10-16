// next
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Tab, Card, Tabs, Box, Container, IconButton, Button, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { get } from '../../../../utils/functions';
// layouts
import Label from '../../../../components/label';

import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { ProfileCover } from '../../../../sections/profile';
import { _userAbout } from '../../../../_mock/arrays';
import { imageLink } from 'src/auth/utils';
import { useSnackbar } from 'notistack';

// Move ProfileAbout out of the render to avoid defining components during render
function ProfileAbout({ areaId, name /* ...other props */ }) {
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
      {areaId && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="material-symbols:description" />
            <strong style={{ marginRight: '5px' }}>{translate('area.areaId')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{areaId}</p>
          </div>
        </div>
      )}

      {name && (
        <div style={{ flexBasis: '30%', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Iconify icon="openmoji:european-name-badge" />
            <strong style={{ marginRight: '5px' }}>{translate('area.areaName')}</strong>:{' '}
            <p style={{ marginRight: '5px' }}>{name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

ProfileAbout.propTypes = {
  areaId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

View_area.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function View_area() {
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

    const getArea = async () => {
      const area = await get('branches', id, enqueueSnackbar);
      if (isMounted) {
        setData(area.data);
      }
    };

    getArea();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('properties.property_id'),
    },
    {
      field: 'name',
      headerName: translate('properties.property_name'),
      flex: 2,
      editable: true,
    },

    {
      field: 'capacity',
      headerName: translate('area.capacity'),
      flex: 2,
      editable: true,
    },
    {
      field: 'property_type',
      flex: 2,
      headerName: translate('properties.property_type'),
      renderCell: (params) => {
        let label;
        if (params.value === 'school' || params.value === 'مدرسة') {
          label = (
            <Label color="warning" sx={{ ml: 1 }}>
              {' '}
              {translate('properties.school_translation')}
            </Label>
          );
        } else if (params.value === null) {
          label = '';
        } else {
          label = (
            <Label color="info" sx={{ ml: 1 }}>
              {' '}
              {translate('properties.mosque_translation')}
            </Label>
          );
        }
        return label;
      },
    },

    {
      field: 'description',
      headerName: translate('area.description'),
      flex: 2,
      editable: true,
    },
    {
      field: 'email',
      headerName: translate('area.email'),
      flex: 2,
      editable: true,
    },
    {
      field: 'location',
      headerName: translate('area.location'),
      flex: 2,
      editable: true,
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
          <IconButton onClick={() => push(PATH_DASHBOARD.property.view(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>

          {/* <IconButton onClick={() => push(PATH_DASHBOARD.property.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];
  const columnsProperty = [
    {
      field: 'admin_user_id',
      flex: 1,
      headerName: translate('area.admin_user_id'),
      valueGetter: (params) => (params.row.admin ? params.row.admin.user.id || '-' : '-'),
    },

    {
      field: 'admin_user_first_name',
      flex: 1,
      headerName: translate('area.admin_user_first_name'),
      valueGetter: (params) => (params.row.admin ? params.row.admin.user.first_name || '-' : '-'),
    },

    {
      field: 'admin_user_last_name',
      flex: 1,
      headerName: translate('area.admin_user_last_name'),
      valueGetter: (params) => (params.row.admin ? params.row.admin.user.last_name || '-' : '-'),
    },

    {
      field: 'admin_user_image',
      flex: 1,
      headerName: translate('area.admin_user_image'),
      renderCell: (params) => (
        <img
          src={`${imageLink}/${params.row.admin?.user?.image}`}
          alt={params.value}
          width={40}
          height={40}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      ),
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
          <IconButton onClick={() => push(PATH_DASHBOARD.branchsAdmin.view(params.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.branchsAdmin.modifiye(params.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

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
            onClick={() => push(PATH_DASHBOARD.area.modifiye(data?.id))}
          >
            <span style={{ cursor: 'pointer', fontSize: '15px' }}>{translate('edit')} </span>
          </Label> */}
          <ProfileAbout areaId={data?.id} name={data?.name} />
        </div>
      ),
    },

    {
      value: translate('area.areas'),
      label: translate('area.areas'),
      icon: <Iconify icon="clarity:building-solid" />,
      component: (
        <DataGridCustom
          data={data?.properties || []}
          columns={columns}
          link={PATH_DASHBOARD.area.modifiye('new')}
        />
      ),
    },

    {
      value: translate('area.branch_admins'),
      label: translate('area.branch_admins'),
      icon: <Iconify icon="subway:admin" />,
      component: (
        <DataGridCustom
          data={data?.branch_admins || []}
          columns={columnsProperty}
          link={PATH_DASHBOARD.branchsAdmin.modifiye('new')}
        />
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>
          {translate('area.areas')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('area.areas')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('area.areas'), href: PATH_DASHBOARD.area.root },
            { name: `${data?.name}`, href: PATH_DASHBOARD.area.root },
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
            image="/assets/logo/area.jpg"
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
