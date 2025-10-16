// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';

import { useBoolean } from '../../../hooks/use-boolean';

import { get, deleteFunc } from '../../../utils/functions';
// layouts
import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
import { useSnackbar } from '../../../components/snackbar';

import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import SubjectsIcons from '../../../sections/general/booking/SubjectsIcons';
import { ConfirmDialog } from '../../../components/custom-dialog';
// ----------------------------------------------------------------------

Subjects.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Subjects() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const [subjectsCount, setSubjectsCount] = useState(0);
  const getSubjects = async () => {
    const subjects = await get('subjects', null, enqueueSnackbar);
    const pagenation = { ...subjects.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setTableData(subjects.data);
    setSubjectsCount(subjects?.hints?.total);
  };
  useEffect(() => {
    getSubjects();
  }, []);
  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('subjects.subjectId'),
    },

    {
      field: 'name',
      flex: 3,
      headerName: translate('subjects.name'),
    },

    {
      field: 'description',
      flex: 6,
      headerName: translate('subjects.description'),
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
          <IconButton onClick={() => push(PATH_DASHBOARD.subjects.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.subjects.modifiye(paramsCell.row.id))}>
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
          {translate('subjects.subjects')} | {translate('hudayi')}
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
                deleteFunc('subjects', params.row.id);
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
              title={translate('subjects.subjectsCount')}
              total={subjectsCount === 0 ? 0 : subjectsCount || 0}
              icon={<SubjectsIcons />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('subjects.subjects')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('subjects.subjects'), href: PATH_DASHBOARD.subjects.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.subjects.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('subjects.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />
        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getSubjects(`subjects?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getSubjects(`subjects?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate.total}
          isPagination
        />{' '}
      </Container>
    </>
  );
}
