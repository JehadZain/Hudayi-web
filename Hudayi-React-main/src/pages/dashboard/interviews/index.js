// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';

import { useAuthContext } from '../../../auth/useAuthContext';

import { get, deleteFunc } from '../../../utils/functions';
// layouts
import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSnackbar } from '../../../components/snackbar';

import { PATH_DASHBOARD } from '../../../routes/paths';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import SeoIllustration from '../../../sections/general/booking/SeoIllustration';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
// ----------------------------------------------------------------------

Interviews.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Interviews() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const getInterviews = async (link) => {
    const interviews = await get(link ?? 'interviews', null, enqueueSnackbar);
    setTableData(interviews.data);
    setTableDataPageinate(interviews.data);
    setInterviewsCount(interviews?.hints?.total);
  };

  const [mainLink, setMainLink] = useState('');
  const { user } = useAuthContext();
  useEffect(() => {
    if (user.role === 'teacher') {
      getInterviews(`interviews-by-teacher/${user.teacher_id}`);
      setMainLink(`interviews-by-teacher/${user.teacher_id}`);
    } else {
      getInterviews();
      setMainLink('interviews');
    }
  }, [user.role, user.teacher_id]);

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('interviews.id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('interviews.name'),
    },

    {
      field: 'event_place',
      flex: 2,
      headerName: translate('interviews.event_place'),
    },

    {
      field: 'goal',
      flex: 2,
      headerName: translate('interviews.goal'),
    },
    {
      field: 'teacher_user_full_name',
      flex: 2,
      headerName: translate('students.teacher_full_name'),
      valueGetter: (paramGetters) => {
        const { teacher } = paramGetters.row;
        return `${teacher?.user?.first_name} ${teacher?.user?.last_name}`;
      },
    },
    {
      field: 'date',
      flex: 2,
      headerName: translate('created_at'),
      renderCell: (paramsCell) => paramsCell.value?.split(' ')[0],
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
          <IconButton
            onClick={() => push(PATH_DASHBOARD.interviews.interviewDetails(paramsCell.row.id))}
          >
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.interviews.modifiye(paramsCell.row.id))}>
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
          {translate('interviews.interviews')} | {translate('hudayi')}
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
                deleteFunc('interviews', params.row?.id);
                setTableData(tableData.filter((e) => e.id !== params.row?.id));
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
              title={translate('interviews.interviewsCount')}
              total={interviewsCount === 0 ? 0 : interviewsCount || 0}
              icon={<SeoIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('interviews.interviews')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('interviews.interviews'), href: PATH_DASHBOARD.interviews.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.interviews.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('interviews.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />
        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          onRowClick={(params) => {
            push(PATH_DASHBOARD.interviews.interviewDetails(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getInterviews(`${mainLink}?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getInterviews(`${mainLink}?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate?.total}
          isPagination
        />
      </Container>
    </>
  );
}
