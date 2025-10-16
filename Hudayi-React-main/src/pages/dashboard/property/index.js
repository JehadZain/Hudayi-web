// next
import Head from 'next/head';

import NextLink from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Grid,
  Button,
  Stack,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';

import { get, deleteFunc } from '../../../utils/functions';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';

import BookingIllustration from '../../../sections/general/booking/BookingIllustration';

import CheckInIllustration from '../../../sections/general/booking/CheckInIllustration';

import CheckOutIllustration from '../../../sections/general/booking/CheckOutIllustration';
import { useSnackbar } from '../../../components/snackbar';

import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

Properties.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Properties() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { push } = useRouter();
  const { asPath } = useRouter();
  const [params, setParams] = useState({});
  const ICONS = {
    building: 'fxemoji:school',
  };
  const [currentTab, setCurrentTab] = useState('properties');
  const handleFilterStatus = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [totalCounts, setTotalCounts] = useState({
    mosqueCount: 0,
    schoolCount: 0,
    propertiesCount: 0,
  });

  const getData = useCallback(
    async (link) => {
      const properties = await get(link ?? 'properties', null, enqueueSnackbar);

      setTableData(properties.data);

      if (!totalCounts.mosqueCount) {
        setTotalCounts((prevCounts) => ({
          ...prevCounts,
          mosqueCount: properties?.hints?.mosque_count || prevCounts.mosqueCount,
        }));
      }

      if (!totalCounts.schoolCount) {
        setTotalCounts((prevCounts) => ({
          ...prevCounts,
          schoolCount: properties?.hints?.school_count || prevCounts.schoolCount,
        }));
      }

      if (!totalCounts.propertiesCount) {
        setTotalCounts((prevCounts) => ({
          ...prevCounts,
          propertiesCount: properties?.hints?.total || prevCounts.propertiesCount,
        }));
      }

      const pagenation = { ...properties.data };
      delete pagenation.data;
      setTableDataPageinate(pagenation);
    },
    [totalCounts.mosqueCount, totalCounts.propertiesCount, totalCounts.schoolCount]
  );

  useEffect(() => {
    getData();
  }, [getData]); // Move totalCounts inside the dependency array

  useEffect(() => {
    getData(currentTab);
  }, [currentTab, getData]);

  const columns = [
    {
      field: 'id',
      headerName: translate('properties.propertyId'),
      flex: 1,
    },

    {
      field: 'image',
      flex: 1,
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
      field: 'name',
      flex: 1,
      headerName: translate('properties.name'),
    },
    {
      field: 'capacity',
      flex: 1,
      headerName: translate('properties.capacity'),
    },
    {
      field: 'property_type',
      flex: 1,
      headerName: translate('properties.property_type'),
      valueFormatter: (paramsFormatter) => {
        if (paramsFormatter.value === 'mosque') {
          return translate('properties.mosque_translation');
        }
        if (paramsFormatter.value === 'school') {
          return translate('properties.school_translation');
        }
        return paramsFormatter.value;
      },
    },

    {
      field: 'description',
      flex: 2,
      headerName: translate('properties.description'),
    },

    {
      field: 'location',
      flex: 2,
      headerName: translate('properties.location'),
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.property.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.property.modifiye(paramsCell.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
          {/* <IconButton
            onClick={() => {
              setParams(paramsCell);
              confirm.onTrue();
            }}
          >
            <Iconify icon="material-symbols:delete" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];
  const confirm = useBoolean();

  const schoolColumns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('schools.id'),
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
      field: 'name',
      flex: 2,
      headerName: translate('schools.schools_name'),
    },

    {
      field: 'capacity',
      flex: 2,
      headerName: translate('schools.capacity'),
    },

    {
      field: 'description',
      flex: 2,
      headerName: translate('schools.description'),
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      flex: 2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.property.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.property.modifiye(paramsCell.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
          {/* <IconButton
            onClick={() => {
              setParams(paramsCell);
              confirm.onTrue();
            }}
          >
            <Iconify icon="material-symbols:delete" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];
  const mosqueColumns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('mosques.mosques_id'),
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
      field: 'name',
      flex: 2,
      headerName: translate('mosques.mosques_name'),
    },

    {
      field: 'capacity',
      flex: 2,
      headerName: translate('mosques.capacity'),
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
      flex: 2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.property.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.property.modifiye(paramsCell.row.id))}>
            <Iconify icon="material-symbols:edit" />
          </IconButton> */}
          {/* <IconButton
            onClick={() => {
              setParams(paramsCell);
              confirm.onTrue();
            }}
          >
            <Iconify icon="material-symbols:delete" />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  let selectedColumns = [];

  if (currentTab === 'properties') {
    selectedColumns = columns || [];
  } else if (currentTab === 'properties-schools') {
    selectedColumns = schoolColumns || [];
  } else {
    selectedColumns = mosqueColumns || [];
  }
  let buttonLabel;
  if (currentTab === 'properties') {
    buttonLabel = translate('properties.add');
  } else if (currentTab === 'properties-schools') {
    buttonLabel = translate('schools.add');
  } else if (currentTab === 'properties-mosques') {
    buttonLabel = translate('mosques.add');
  } else {
    buttonLabel = translate('admins.add');
  }

  const getLinkForTab = (tabValue) => {
    if (tabValue === 'properties') {
      return PATH_DASHBOARD.property.modifiye('new');
    }
    if (tabValue === 'properties-schools') {
      return PATH_DASHBOARD.schools.modifiye;
    }
    if (tabValue === 'properties-mosques') {
      return PATH_DASHBOARD.mosques.modifiye;
    }
    return PATH_DASHBOARD.users.adminModifiye('new');
  };

  const buttonLink = getLinkForTab(currentTab);

  return (
    <>
      <Head>
        <title>
          {translate('properties.properties')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title={translate('delete')}
          content={translate('deleteTitle')}
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteFunc('properties', params.row.id);
                setTableData(tableData.filter((e) => e.id !== params.row.id));
                confirm.onFalse();
                enqueueSnackbar(translate('deleteMessage'), { variant: 'success' });
              }}
            >
              {translate('delete')}
            </Button>
          }
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('properties.analytic_property')}
              total={totalCounts.propertiesCount === 0 ? 0 : totalCounts.propertiesCount || 0}
              icon={<CheckOutIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('properties.analytic_mosque')}
              total={totalCounts.mosqueCount === 0 ? 0 : totalCounts.mosqueCount || 0}
              icon={<BookingIllustration />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('properties.analytic_school')}
              total={totalCounts.schoolCount === 0 ? 0 : totalCounts.schoolCount || 0}
              icon={<CheckInIllustration />}
            />
          </Grid>
        </Grid>

        <CustomBreadcrumbs
          heading={translate('properties.properties')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },

            { name: translate('properties.properties'), href: PATH_DASHBOARD.property.root },
            { name: translate('properties.list') },
          ]}
          // action={
          //   <div>
          //     <Button
          //       variant="contained"
          //       sx={{ marginRight: '20px' }}
          //       onClick={() => {
          //         push(PATH_DASHBOARD.property.modifiye('new'));
          //       }}
          //       startIcon={<Iconify icon="eva:plus-fill" />}
          //     >
          //       {translate('properties.add')}
          //     </Button>
          //     <Button
          //       variant="contained"
          //       onClick={() => {
          //         push(PATH_DASHBOARD.propertyAdmin.modifiye('new'));
          //       }}
          //       startIcon={<Iconify icon="eva:plus-fill" />}
          //     >
          //       {/* Text for the duplicated button */}
          //       {translate('property_admins.add')}
          //     </Button>
          //   </div>
          // }
          sx={{ marginTop: '30px' }}
        />
        <Card>
          <Tabs
            value={currentTab}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
            }}
          >
            <Tab key="tab1" label={translate('properties.properties')} value="properties" />

            <Tab key="tab2" label={translate('properties.schools')} value="properties-schools" />
            <Tab key="tab3" label={translate('properties.mosques')} value="properties-mosques" />
          </Tabs>
          <DataGridCustom
            key={`tableData_${tableData?.data}`}
            data={tableData?.data || tableData || []}
            columns={selectedColumns}
            onRowClick={(params) => {
              push(PATH_DASHBOARD.property.view(params.row.id));
            }}
            pageSize={pageSize}
            onPageChange={async (newPage) => {
              const page = newPage + 1;
              setPageNumber(page);
              if (currentTab === 'properties') {
                await getData(`properties?page=${page}&perpage=${pageSize}`);
              } else if (currentTab === 'properties-schools') {
                await getData(`properties-schools?page=${page}&perpage=${pageSize}`);
              } else if (currentTab === 'properties-mosque') {
                await getData(`properties-mosque?page=${page}&perpage=${pageSize}`);
              }
            }}
            onPageSizeChange={async (newSize) => {
              setPageSize(newSize);
              if (currentTab === 'properties') {
                await getData(`properties?page=${pageNumber}&perpage=${newSize}`);
              }
              if (currentTab === 'properties-schools') {
                await getData(`properties-schools?page=${pageNumber}&perpage=${newSize}`);
              }

              if (currentTab === 'properties-mosque') {
                await getData(`properties-mosque?page=${pageNumber}&perpage=${newSize}`);
              }
            }}
            page={pageNumber}
            total={tableDataPageinate.total}
            isPagination
          />
        </Card>
      </Container>
    </>
  );
}
