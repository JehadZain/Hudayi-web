// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../auth/useAuthContext';

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
import SeverErrorIllustration from '../../../sections/general/booking/SeverErrorIllustration';
import { ConfirmDialog } from '../../../components/custom-dialog';

// ----------------------------------------------------------------------

Sessions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Sessions() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [sessionsCount, setSessionsCount] = useState(0);
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const getSessions = async (link) => {
    const sessions = await get(link ?? 'sessions', null , enqueueSnackbar);
    setTableData(sessions.data);
    setSessionsCount(sessions?.hints?.total);
    const pagenation = { ...sessions.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
  };
  const [mainLink, setMainLink] = useState('');
  useEffect(() => {
    if (user.role === 'teacher') {
      getSessions(`sessions-by-teacher/${user.teacher_id}`);
      setMainLink(`sessions-by-teacher/${user.teacher_id}`);
    } else {
      getSessions();
      setMainLink('sessions');
    }
  }, [user.role, user.teacher_id]);

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('sessions.sessionId'),
    },

    {
      field: 'name',
      flex: 2,
      headerName: translate('sessions.name'),
    },

    {
      field: 'type',
      flex: 2,
      headerName: translate('sessions.type'),
      renderCell: (paramsCell) => (paramsCell.value === null ? '-' : paramsCell.value),
    },

    {
      field: 'duration',
      flex: 2,
      headerName: translate('sessions.duration'),
    },

    {
      field: 'teacher_user_full_name',
      flex: 2,
      headerName: translate('teachers.teacher_full_name'),
      valueGetter: (paramsGetter) => {
        const { teacher } = paramsGetter.row;
        if (teacher === null) {
          return '-';
        }
        return `${teacher?.user?.first_name} ${teacher?.user?.last_name}`;
      },
    },
    {
      field: 'start_at',
      flex: 2,
      headerName: translate('created_at'),
      renderCell: (paramsCell) => paramsCell.value?.split(' ')[0],
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
          <IconButton onClick={() => push(PATH_DASHBOARD.sessions.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.sessions.modifiye(paramsCell.row.id))}>
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
          {translate('sessions.sessions')} | {translate('hudayi')}
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
                deleteFunc('sessions', params.row?.id);
                setTableData(tableData.data.filter((e) => e.id !== params.row?.id));
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
              title={translate('sessions.sessionsCount')}
              total={sessionsCount === 0 ? 0 : sessionsCount || 0}
              icon={<SeverErrorIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('sessions.attainadances')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('sessions.sessions'), href: PATH_DASHBOARD.sessions.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.sessions.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('sessions.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />
        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          onRowClick={(params) => {
            push(PATH_DASHBOARD.sessions.view(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getSessions(`${mainLink}?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getSessions(`${mainLink}?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate?.total}
          isPagination
        />
      </Container>
    </>
  );
}
