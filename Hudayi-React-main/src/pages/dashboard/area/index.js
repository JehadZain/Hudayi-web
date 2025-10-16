import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { Container, IconButton, Button, Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { get, deleteFunc } from '../../../utils/functions';
// layouts
import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
import { useSnackbar } from '../../../components/snackbar';

import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import AreaIcon from '../../../sections/general/booking/AreaIcon';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import { BookingCustomerReviews, BookingNewestBooking } from '../../../sections/booking';
import { _bookingNew, _bookingReview } from '../../../_mock/arrays';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';

// ----------------------------------------------------------------------

Areas.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Areas() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [params, setParams] = useState({});

  const [areasCount, setAreasCount] = useState(0);
  const getAreas = useCallback(async (link) => {
    const areas = await get(link ?? 'branches', null, enqueueSnackbar);
    setTableData(areas.data?.data);
    const pagenation = { ...areas.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setAreasCount(areas?.hints?.total);
  }, []);

  useEffect(() => {
    getAreas();
  }, [getAreas]);

  const columns = [
    {
      field: 'id',
      flex: 5,
      headerName: translate('area.areaId'),
    },

    {
      field: 'name',
      headerName: translate('area.areaName'),
      flex: 5,
      editable: true,
    },

    {
      field: 'action',
      headerName: ' ',
      flex: 2,
      align: 'right',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.area.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.area.modifiye(paramsCell.row.id))}>
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
          {translate('area.areas')} | {translate('hudayi')}
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
                deleteFunc('branches', params.row.id);
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
          <Grid item xs={12} md={12}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('area.areas_count')}
              total={areasCount === 0 ? 0 : areasCount || 0}
              icon={<AreaIcon />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('area.areas')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('area.areas'), href: PATH_DASHBOARD.area.root },
          ]}
          // action={
          //   <Stack direction='row'>
          //     <Button
          //       variant="contained"
          //       sx={{ marginRight: '10px' }}
          //       onClick={() => {
          //         push(PATH_DASHBOARD.branchsAdmin.modifiye('new'));
          //       }}
          //       startIcon={<Iconify icon="eva:plus-fill" />}
          //     >
          //       {translate('area.branch_admin_add')}
          //     </Button>

          //     <Button
          //       variant="contained"
          //       onClick={() => {
          //         push(PATH_DASHBOARD.area.modifiye('new'));
          //       }}
          //       startIcon={<Iconify icon="eva:plus-fill" />}
          //     >
          //       {translate('area.addArea')}
          //     </Button>
          //   </Stack>
          // }
          sx={{ marginTop: '30px' }}
        />

        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          onRowClick={(params) => {
            push(PATH_DASHBOARD.area.view(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getAreas(`branches?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getAreas(`branches?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate.total}
          isPagination
        />
      </Container>
    </>
  );
}
