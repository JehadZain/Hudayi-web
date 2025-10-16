// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
import { useAuthContext } from '../../../auth/useAuthContext';

import { useSnackbar } from '../../../components/snackbar';

import { deleteFunc, get } from '../../../utils/functions';
// layouts
import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import { CustomAvatar } from '../../../components/custom-avatar';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import QuranquizesIcon from '../../../sections/general/booking/QuranquizesIcon';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
// ----------------------------------------------------------------------

Quranquizes.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Quranquizes() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const [QuizesCount, setQuizesCount] = useState(0);
  const [params, setParams] = useState({});
  const getQuranQuizes = async (link) => {
    const quranQuizes = await get(link ?? 'quran-quizzes', null, enqueueSnackbar);
    setTableData(quranQuizes.data?.data);
    setTableDataPageinate(quranQuizes.data);
    setQuizesCount(quranQuizes?.hints?.total);
  };
  const [mainLink, setMainLink] = useState('');
  
    const getMarks = () => {
  // Equivalent translation map
  const marks = {
    "100": translate('quranQuizes.excellent'),
    "75": translate('quranQuizes.veryGood'),
    "50": translate('quranQuizes.good'),
    "25":  translate('quranQuizes.average'),
    "0": translate('quranQuizes.fail'),
    };
    return marks;
  };

  const getScoreLabel = (score) => {
    const marks = getMarks();
    // Find the appropriate label based on score thresholds
    const thresholds = Object.keys(marks)
      .map(Number)
      .sort((a, b) => b - a);
    
    // Use find to get the first threshold that the score meets
    const matchingThreshold = thresholds.find(threshold => score >= threshold);
    
    // Return matching label or default to fail
    return marks[matchingThreshold ?? "0"];
  };

  useEffect(() => {
    if (user.role === 'teacher') {
      getQuranQuizes(`quran-quizzes-by-teacher/${user.teacher_id}`);
      setMainLink(`quran-quizzes-by-teacher/${user.teacher_id}`);
    } else {
      getQuranQuizes();
      setMainLink('quran-quizzes');
    }
  }, [user.role, user.teacher_id]);
  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('quranQuizes.id'),
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('quranQuizes.name'),
    },
    {
      field: 'page',
      flex: 2,
      headerName: translate('quranQuizes.page'),
    },

    {
      field: 'juz',
      flex: 2,
      headerName: translate('quranQuizes.juz'),
    },

    {
      field: 'score',
      flex: 2,
      headerName: translate('quranQuizes.score'),
      valueGetter: (paramsGetter) => {
        const dateValue = paramsGetter.row?.score || '-';
     
        return getScoreLabel(dateValue)
      },
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
      field: 'student_user_full_name',
      flex: 2,
      headerName: translate('quranQuizes.student_full_name'),
      valueGetter: (paramsGetter) => {
        const { student } = paramsGetter.row;
        return `${student?.user?.first_name} ${student?.user?.last_name}`;
      },
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
            onClick={() => push(PATH_DASHBOARD.quranQuizes.quranQuizeDetails(paramsCell.row.id))}
          >
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.quranQuizes.modifiye(paramsCell.row.id))}>
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
                deleteFunc('quran-quizzes', params.row.id);
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
              icon={<QuranquizesIcon />}
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
          //       push(PATH_DASHBOARD.quranQuizes.modifiye('new'));
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
            push(PATH_DASHBOARD.quranQuizes.quranQuizeDetails(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getQuranQuizes(`${mainLink}?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getQuranQuizes(`${mainLink}?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate?.total}
          isPagination
        />{' '}
      </Container>
    </>
  );
}
