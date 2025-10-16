import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../auth/useAuthContext';

import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';

import { get, deleteFunc } from '../../../utils/functions';
// layouts
import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
import { useSnackbar } from '../../../components/snackbar';

import { useSettingsContext } from '../../../components/settings';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import AreaIcon from '../../../sections/general/booking/AreaIcon';
import UpgradeStorageIllustration from '../../../sections/general/booking/UpgradeStorageIllustration';

import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import { BookingCustomerReviews, BookingNewestBooking } from '../../../sections/booking';
import { _bookingNew, _bookingReview } from '../../../_mock/arrays';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';

// ----------------------------------------------------------------------

Activities.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Activities() {
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [ActivityCount, setActivityCount] = useState(0);
  const [params, setParams] = useState({});
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const { enqueueSnackbar } = useSnackbar();
  const [rowCountState, setRowCountState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const getActivities = async (link, page = 0, customPageSize = 5) => {
    setIsLoading(true);

    try {
      const activities = await get(link ?? `activities?page=${page + 1}&perPage=${customPageSize}`, null, enqueueSnackbar);
      setTableData(activities.data?.data);
      setRowCountState(activities.data?.total);
      setActivityCount(activities?.hints?.total);
      setTableDataPageinate(activities.data);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };
  const [mainLink, setMainLink] = useState('');
  const { user } = useAuthContext();
  useEffect(() => {
    if (user.role === 'teacher') {
      getActivities(`activities-by-teacher/${user.teacher_id}`);
      setMainLink(`activities-by-teacherteacher/${user.teacher_id}`);
    } else {
      getActivities();
      setMainLink('activities');
    }
  }, [paginationModel.page, paginationModel.pageSize, user.role, user.teacher_id]); // Fetch data when paginationModel changes

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('activities.id'),
    },
    {
      field: 'class_room_id',
      flex: 2,
      headerName: translate('activities.class_room_id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('activities.name'),
    },

    {
      field: 'place',
      flex: 2,
      headerName: translate('activities.place'),
    },

    {
      field: 'cost',
      flex: 2,
      headerName: translate('activities.cost'),
    },

    {
      field: 'result',
      flex: 2,
      headerName: translate('activities.result'),
      valueGetter: (paramsGetter) => {
        const result = paramsGetter.row?.result;

        if (result === null) {
          return '-';
        }

        return result;
      },
    },

    {
      field: 'note',
      flex: 2,
      headerName: translate('activities.note'),
      valueGetter: (paramsGetter) => {
        const note = paramsGetter.row?.note;

        if (note === null) {
          return '-';
        }

        return note;
      },
    },
     {
      field: 'start_datetime',
      flex: 2,
      headerName: translate('created_at'),
      renderCell: (paramsCell) => paramsCell.value?.split(' ')[0],
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
          <IconButton
            onClick={() => push(PATH_DASHBOARD.activities.activityDetails(paramsCell.row.id))}
          >
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.activities.modifiye(paramsCell.row.id))}>
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

  return (
    <>
      <Head>
        <title>
          {translate('activities.activities')} | {translate('hudayi')}
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
                deleteFunc('activities', params.row.id);
                setTableData(tableData.filter((e) => e.id !== params.row.id));
                confirm.onFalse();
              }}
            >
              {translate('delete')}
            </Button>
          }
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('activities.activityCount')}
              total={ActivityCount === 0 ? 0 : ActivityCount || 0}
              icon={<UpgradeStorageIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('activities.activities')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('activities.activities'), href: PATH_DASHBOARD.activities.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.activities.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('activities.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />
        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          onRowClick={(params) => {
            push(PATH_DASHBOARD.activities.activityDetails(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getActivities(`${mainLink}?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getActivities(`${mainLink}?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate?.total}
          isPagination
        />
      </Container>
    </>
  );
}
