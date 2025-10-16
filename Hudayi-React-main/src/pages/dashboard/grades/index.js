// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { get, deleteFunc } from '../../../utils/functions';
// layouts
import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSnackbar } from '../../../components/snackbar';

import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import OrderCompleteIllustration from '../../../sections/general/booking/OrderCompleteIllustration';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';

// ----------------------------------------------------------------------

Grades.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Grades() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [gradesCount, setGradesCount] = useState(0);
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  
  const getGrades = async (link) => {
    const grades = await get(link ?? 'grades', null, enqueueSnackbar);
    setTableData(grades.data?.data);
    const pagenation = { ...grades.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setGradesCount(grades?.hints?.total);
  };
  useEffect(() => {
    getGrades();
  }, []);
  const columns = [
    {
      field: 'id',
      flex: 1,
      headerName: translate('grades.id'),
    },

    {
      field: 'name',
      flex: 1,
      headerName: translate('grades.name'),
    },
   
    {
      field: 'description',
      flex: 1,
      headerName: translate('grades.description'),
    },

    {
      field: 'property_name',
      flex: 1,
      headerName: translate('properties.name'),
      valueGetter: (paramsGetter) => paramsGetter.row.property?.name,
    },

    {
      field: 'property',
      flex: 1,
      headerName: translate('properties.property_type'),
      valueGetter: (paramsGetter) => paramsGetter.row.property?.property_type,
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
      field: 'action',
      headerName: ' ',
      align: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      flex: 1,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.grades.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.grades.modifiye(paramsCell.row.id))}>
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
          {translate('grades.grades')} | {translate('hudayi')}
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
                deleteFunc('grades', params.row.id);
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
              title={translate('grades.gradesCount')}
              total={gradesCount === 0 ? 0 : gradesCount || 0}
              icon={<OrderCompleteIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('grades.grades')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('grades.grades'), href: PATH_DASHBOARD.grades.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.grades.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('grades.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />

        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          onRowClick={(params) => {
            push(PATH_DASHBOARD.grades.view(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getGrades(`grades?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getGrades(`grades?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate.total}
          isPagination
        />
      </Container>
    </>
  );
}
