// next
import PropTypes from 'prop-types';

import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Container, IconButton, Button, Grid, Stack, Card, Tabs, Tab } from '@mui/material';
import { get, deleteFunc, postFormData } from '../../../utils/functions';
import { useLocales } from '../../../locales';

import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSnackbar } from '../../../components/snackbar';

import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';

import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import PageNotFoundIllustration from '../../../sections/general/booking/PageNotFoundIllustration';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import { Pending } from '../../../sections/general/booking';
import { useAuthContext } from '../../../auth/useAuthContext';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

ClassRooms.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
ClassRooms.propTypes = {
  isEdit: PropTypes.bool,
};
// ----------------------------------------------------------------------

export default function ClassRooms({ isEdit }) {
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const { translate } = useLocales();

  const [classRoomPendingCount, setClassRoomPendingCount] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [classRoomApprovedCount, setClassRoomApprovedCount] = useState(0);
  const { user } = useAuthContext();
  const [totalCounts, setTotalCounts] = useState({
    classRoomCount: 0,
    pendingCount: 0,
  });

  const [params, setParams] = useState({});
  const [done, isDone] = useState(true);
  const ICONS = {
    building: 'fxemoji:school',
  };
  const [currentTab, setCurrentTab] = useState('class-room');
  const handleFilterStatus = (event, newValue) => {
    if (newValue === 'class-room/pending') {
      getClassRoomsPending();
    } else {
      getClassRooms();
    }
    setCurrentTab(newValue);
  };

  const getClassRooms = useCallback(async (link) => {
    const classRooms = await get(link ?? 'mosque/class-room/approved', null, enqueueSnackbar);
    setTableData(classRooms.data?.data);
    const pagenation = { ...classRooms.data };
    delete pagenation.data;

    setClassRoomApprovedCount(classRooms?.hints?.total);
    setTableDataPageinate(pagenation);
  }, []);

  const getClassRoomsPending = useCallback(async (link) => {
    const classRoomsPending = await get(link ?? 'mosque/class-room/pending', null, enqueueSnackbar);
    setTableData(classRoomsPending.data?.data);
    const pagenation = { ...classRoomsPending.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setClassRoomPendingCount(classRoomsPending?.hints?.total);
  }, []);

  useEffect(() => {
    if (user.role !== 'teacher') {
      getClassRoomsPending();
    }
    getClassRooms();
  }, [getClassRooms, getClassRoomsPending, user.role]);

  // Define the changeStatue function that takes a status parameter
  const changeStatue = async (status, paramsClassRoom) => {
    try {
      const classRoom = await postFormData(`class-room/${paramsClassRoom.id}`, {
        name: paramsClassRoom.name,
        capacity: paramsClassRoom.capacity,
        grade_id: paramsClassRoom.grade_id,
        is_approved: status,
      });
    } catch (error) {
      console.error('API call error:', error);
      enqueueSnackbar('Error', { variant: 'error' });
    }
  };

  const confirm = useBoolean();

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('classRoomsMosque.classRoomsMosque_id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('classRooms.name'),
    },
    {
      field: 'capacity',
      flex: 2,
      headerName: translate('classRooms.capacity'),
      renderCell: (paramsCell) => (paramsCell.value === null ? '-' : paramsCell.value),
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
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      flex: 2,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.classRoomsMosque.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton
            onClick={() => push(PATH_DASHBOARD.classRoomsMosque.modifiye(paramsCell.row.id))}
          >
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

  const unApproaved = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('classRoomsMosque.classRoomsMosque_id'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('classRooms.name'),
    },

    {
      field: 'capacity',
      flex: 2,
      headerName: translate('classRooms.capacity'),
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
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      filterable: false,
      flex: 2,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton
            onClick={() => {
              changeStatue('0', paramsCell.row);
              setParams(paramsCell);
              confirm.onTrue();
            }}
          >
            <Label style={{ cursor: 'pointer' }} variant="filled" color="error">
              <Iconify icon="material-symbols:close" />
            </Label>
          </IconButton>
          <IconButton
            onClick={() => {
              changeStatue('1', paramsCell.row);
              setTableData(tableData.filter((e) => e.id !== paramsCell.row.id));
              confirm.onFalse();
            }}
          >
            <Label style={{ cursor: 'pointer' }} variant="filled" color="success">
              <Iconify icon="icon-park-outline:correct" />
            </Label>
          </IconButton>
        </Stack>
      ),
    },
  ];

  let selectedColumns = [];

  if (currentTab === 'class-room') {
    selectedColumns = columns || [];
  } else if (currentTab === 'class-room/pending') {
    selectedColumns = unApproaved || [];
  }

  return (
    <>
      <Head>
        <title>
          {translate('classRoomsMosque.classRoomsMosque')} | {translate('hudayi')}
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
                deleteFunc('class-room', params.row.id);
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
          <Grid item xs={6} md={6}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('classRoomsMosque.classRoomsMosqueCount')}
              total={classRoomApprovedCount || 0}
              icon={<PageNotFoundIllustration />}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('classRoomsMosque.classRoomsMosqueCountPending')}
              total={classRoomPendingCount || 0}
              icon={<Pending />}
            />
          </Grid>
        </Grid>

        <CustomBreadcrumbs
          heading={translate('classRoomsMosque.classRoomsMosque')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            {
              name: translate('classRoomsMosque.classRoomsMosque'),
              href: PATH_DASHBOARD.classRoomsMosque.root,
            },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.classRoomsMosque.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('classRoomsMosque.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />

        {done ? (
          <Card>
            {user.role !== 'teacher' && (
              <Tabs
                value={currentTab}
                onChange={handleFilterStatus}
                sx={{
                  px: 2,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Tab
                  key="tab1"
                  label={translate('classRoomsMosque.classRoomsMosque')}
                  value="class-room"
                />
                <Tab
                  key="tab2"
                  label={translate('classRooms.unapproaved')}
                  value="class-room/pending"
                />
              </Tabs>
            )}
            <DataGridCustom
              key={`tableData_${tableData?.data}`}
              data={tableData?.data || tableData || []}
              columns={selectedColumns}
              onRowClick={(params) => {
                push(PATH_DASHBOARD.classRoomsMosque.view(params.row.id));
              }}
              pageSize={pageSize}
              onPageChange={async (newPage) => {
                const page = newPage + 1;
                setPageNumber(page);
                if (currentTab === 'class-room/pending') {
                  await getClassRoomsPending(
                    `mosque/class-room/pending?page=${page}&perpage=${pageSize}`
                  );
                } else {
                  await getClassRooms(
                    `mosque/class-room/approved?page=${page}&perpage=${pageSize}`
                  );
                }
              }}
              onPageSizeChange={async (newSize) => {
                setPageSize(newSize);
                if (currentTab === 'class-room/pending') {
                  await getClassRoomsPending(
                    `mosque/class-room/pending?page=${pageNumber}&perpage=${newSize}`
                  );
                } else {
                  await getClassRooms(
                    `mosque/class-room/approved?page=${pageNumber}&perpage=${newSize}`
                  );
                }
              }}
              page={pageNumber}
              total={tableDataPageinate.total}
              isPagination
            />
          </Card>
        ) : (
          <LoadingScreen />
        )}
      </Container>
    </>
  );
}
