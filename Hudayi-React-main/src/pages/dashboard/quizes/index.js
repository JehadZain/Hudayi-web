import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
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

Quizes.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Quizes() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [QuizesCount, setQuizesCount] = useState(0);
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const getQuizes = async (link) => {
    const quizes = await get(link ?? 'quizzes', null, enqueueSnackbar);
    const pagenation = { ...quizes.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setTableData(quizes.data?.data);
    setQuizesCount(quizes?.hints?.total);
  };
  const [mainLink, setMainLink] = useState('');
  const { user } = useAuthContext();
  useEffect(() => {
    if (user.role === 'teacher') {
      getQuizes(`quizzes-by-teacher/${user.teacher_id}`);
      setMainLink(`quizzes-by-teacher/${user.teacher_id}`);
    } else {
      getQuizes();
      setMainLink('quizzes');
    }
  }, [user.role, user.teacher_id]);

  const getQuizTypeValue = (value) => {
    if (value === "quran") {
      return translate("quran");
    }
    if (value === "curriculum") {
      return translate("quranQuizes.curriculum");
    }
    if (value === "correctArabicReading") {
      return translate("correctArabicReading");
    }
    return translate("not_available");
  };

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('quizes.id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('quizes.name'),
    },
    {
      field: 'quiz_subject',
      flex: 2,
      headerName: translate('quizes.quiz_subject'),
    },

    {
      field: 'quiz_type',
      flex: 2,
      headerName: translate('quizes.quiz_type'),
      valueGetter: (paramsGetter) => {
        const {quiz_type} = paramsGetter.row;
        return  getQuizTypeValue(quiz_type);
      },
    },

    {
      field: 'score',
      flex: 2,
      headerName: translate('quizes.score'),
    },

    {
      field: 'student_user_full_name',
      flex: 2,
      headerName: translate('students.student_full_name'),
      valueGetter: (paramsGetter) => {
        const { student } = paramsGetter.row;
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
          <IconButton onClick={() => push(PATH_DASHBOARD.quizes.quizDetails(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.quizes.modifiye(paramsCell.row.id))}>
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
          {translate('quizes.quizes')} | {translate('hudayi')}
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
                deleteFunc('quizzes', params.row.id);
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
              title={translate('quizes.quizeCount')}
              total={QuizesCount === 0 ? 0 : QuizesCount || 0}
              icon={<SeverErrorIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('quizes.quizes')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('quizes.quizes'), href: PATH_DASHBOARD.quizes.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.quizes.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('quizes.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />
        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          onRowClick={(params) => {
            push(PATH_DASHBOARD.quizes.quizDetails(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getQuizes(`${mainLink}?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getQuizes(`${mainLink}?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate?.total}
          isPagination
        />
      </Container>
    </>
  );
}
