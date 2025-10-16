// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
import { useAuthContext } from '../../../auth/useAuthContext';

import { deleteFunc, get } from '../../../utils/functions';
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
import UploadIllustration from '../../../sections/general/booking/UploadIllustration';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';

// ----------------------------------------------------------------------

Notes.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Notes() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [notesCount, setnotesCount] = useState(0);
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const getNotes = async (link) => {
    const notes = await get(link ?? 'notes', null, enqueueSnackbar);
    setTableData(notes.data);
    setTableDataPageinate(notes.data);
    setnotesCount(notes?.hints?.total);
  };
  const [mainLink, setMainLink] = useState('');
  const { user } = useAuthContext();
  useEffect(() => {
    if (user.role === 'teacher') {
      getNotes(`notes-by-teacher/${user.teacher_id}`);
      setMainLink(`notes-by-teacher/${user.teacher_id}`);
    } else {
      getNotes();
      setMainLink('notes');
    }
  }, [user.role, user.teacher_id]);
  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('notes.id'),
    },
    {
      field: 'date',
      flex: 2,
      headerName: translate('students.interview_date'),
      valueGetter: (paramsGetter) => {
        const dateValue = paramsGetter.row.date || '-';
        const date = new Date(dateValue);

        // Check if the date is valid using Number.isNaN
        if (Number.isNaN(date.getTime())) {
          return '-';
        }

        return date.toLocaleDateString();
      },
    },

    {
      field: 'admin_content',
      flex: 2,
      headerName: translate('notes.admin_content'),
      valueGetter: (paramsGetter) => {
        const adminContent = paramsGetter.row.admin_content;

        // Check if admin_content is null
        if (adminContent === null) {
          return '-';
        }

        return adminContent;
      },
    },

    {
      field: 'teacher_content',
      flex: 2,
      headerName: translate('notes.teacher_content'),
      valueGetter: (paramsGetter) => {
        const teacherContent = paramsGetter.row.teacher_content;

        // Check if admin_content is null
        if (teacherContent === null) {
          return '-';
        }

        return teacherContent;
      },
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
      field: 'student_user_full_name',
      flex: 2,
      headerName: translate('students.student_full_name'),
      valueGetter: (paramsGetter) => {
        const { student } = paramsGetter.row;
        if (student === null) {
          return '-';
        }
        return `${student?.user?.first_name} ${student?.user?.last_name}`;
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
          <IconButton onClick={() => push(PATH_DASHBOARD.notes.noteDetails(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.notes.modifiye(paramsCell.row.id))}>
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
          {translate('notes.notes')} | {translate('hudayi')}
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
                deleteFunc('notes', params.row.id);
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
              title={translate('notes.notesCount')}
              total={notesCount === 0 ? 0 : notesCount || 0}
              icon={<UploadIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('notes.notes')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('notes.notes'), href: PATH_DASHBOARD.notes.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.notes.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('notes.add')}
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
            await getNotes(`${mainLink}?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getNotes(`${mainLink}?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate?.total}
          isPagination
        />
      </Container>
    </>
  );
}
