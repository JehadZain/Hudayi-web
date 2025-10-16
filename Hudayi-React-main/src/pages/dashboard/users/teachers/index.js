// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useCallback, useState, useEffect } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Button,
  Grid,
  Stack,
  Card,
  Tabs,
  Tab,
} from '@mui/material';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

import Label from '../../../../components/label';

import { get, deleteFunc, postFormData } from '../../../../utils/functions';
import { useSnackbar } from '../../../../components/snackbar';
import LoadingScreen from '../../../../components/loading-screen/LoadingScreen';

import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import BookingWidgetSummary from '../../../../sections/general/booking/BookingWidgetSummary';
import ComingSoonIllustration from '../../../../sections/general/booking/ComingSoonIllustration';
import { useBoolean } from '../../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../../components/custom-dialog';
import { Pending } from '../../../../sections/general/booking';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

Teachers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Teachers() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);
  const [done, isDone] = useState(true);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [teachersCount, setTeachersCount] = useState(0);
  const [teachersCountPending, setTeachersCountPending] = useState(0);

  const [currentTab, setCurrentTab] = useState('teachers');
  const handleFilterStatus = (event, newValue) => {
    if (newValue === 'users/pending') {
      getTeacherPending();
    } else {
      getTeachers();
    }
    setCurrentTab(newValue);
  };

  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };

  const getTeachers = useCallback(async (link) => {
    const teachers = await get(link ?? 'teachers', null, enqueueSnackbar);
    setTableData(teachers.data?.data);
    const pagenation = { ...teachers.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setTeachersCount(teachers?.hints?.total);
  }, []);

  const getTeacherPending = useCallback(async (link) => {
    const teacherPending = await get(link ?? 'users/pending', null, enqueueSnackbar);
    setTableData(teacherPending.data?.data);
    const pagenation = { ...teacherPending.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setTeachersCountPending(teacherPending?.hints?.total);
  }, []);

  useEffect(() => {
    getTeachers();
  }, [getTeachers]);

  const changeStatue = async (status, paramsTeacher) => {
    try {
      const teacher = await postFormData(`teachers/${paramsTeacher.id}`, {
        name: paramsTeacher.name,
        first_name: paramsTeacher.user.first_name,
        last_name: paramsTeacher.user.last_name,
        is_approved: status,
      });
    } catch (error) {
      // Handle the error here
      console.error('An error occurred:', error);
    }
  };

  const confirm = useBoolean();

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('teachers.teacherId'),
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('teachers.image'),
      renderCell: (cellParams) => {
        const { user } = cellParams.row;

        return (
          <>
            {user?.image ? (
              <img
                src={`${imageLink}/${user.image}`}
                alt={user.first_name}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify
                icon={ICONS.avatarman}
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
      field: 'teacher_user_full_name',
      flex: 2,
      minWidth:140,
      headerName: translate('teachers.teacher_full_name'),
      valueGetter: (valueParams) =>
        `${valueParams.row.user?.first_name} ${valueParams.row.user?.last_name}`,
    },

    {
      field: 'email',
      minWidth:270,
      flex: 2,
      headerName: translate('teachers.email'),
      valueGetter: (valueParams) => valueParams.row.user?.email,
    },

    {
      field: 'gender',
      flex: 2,
      minWidth:100,
      headerName: translate('students.gender'),
      valueGetter: (paramsValue) => paramsValue.row.user?.gender,
      valueFormatter: (paramsFormatter) => {
        if (paramsFormatter.value === 'female') {
          return translate('students.female');
        }
        if (paramsFormatter.value === 'male') {
          return translate('students.male');
        }
        return paramsFormatter.value;
      },
    },

    {
      field: 'status',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.status'),

      valueGetter: (valueParams) => valueParams.row.user?.status,
      renderCell: (valueParams) => {
        let label;
        if (valueParams.value === '1' || valueParams.value === '1') {
          label = (
            <Label color="success" sx={{ ml: 1 }}>
              {translate('teachers.active_statues')}
            </Label>
          );
        } else if (!valueParams.value) {
          label = null; // Set label to null when status is null or empty string
        } else {
          label = (
            <Label color="error" sx={{ ml: 1 }}>
              {translate('teachers.inactive_statues')}
            </Label>
          );
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ backgroundColor: valueParams.value === '1' ? 'success' : 'error' }} />
            {label}
          </div>
        );
      },
    },


    {
      field: 'birth place',
      flex: 2,
      minWidth:160,
      headerName: translate('teachers.birth_place'),
      valueGetter: (valueParams) => valueParams.row?.user?.birth_place,
    },


    {
      field: 'marital status',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.marital_status'),
      valueGetter: (valueParams) => {
        const status = valueParams.row?.marital_status;
        if (status === 'married') return translate('teachers.marital_status_married');
        if (status === 'single') return translate('teachers.marital_status_single');
        if (status === 'divorced') return translate('teachers.marital_status_divorced');
        if (status === 'widow') return translate('teachers.marital_status_widow');
        return status; // Fallback if translation is not available
      },
    },
    

    {
      field: 'birth date',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.birth_date'),
      valueGetter: (valueParams) => {
        const birthDate = valueParams.row.user?.birth_date;
        return birthDate ? format(new Date(birthDate), 'yyyy-MM-dd') : '';
      },
    },


    {
      field: 'current address',
      flex: 2,
      minWidth:200,
      headerName: translate('teachers.current_address'),
      valueGetter: (valueParams) => valueParams.row.user?.current_address,
    },


    {
      field: 'blood type',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.blood_type'),
      valueGetter: (valueParams) => valueParams.row.user?.blood_type,
    },


    {
      field: 'are there disease in family',
      flex: 2,
      minWidth:100,
      headerName: translate('students.are_there_disease_in_family'),
      valueFormatter: (paramsFormatter) => {
        if (paramsFormatter.value === 1 || paramsFormatter.value === '1') {
          return translate('students.yes');
        }
        if (paramsFormatter.value === 0 || paramsFormatter.value === '0') {
          return translate('students.no');
        }
        return paramsFormatter.value;
      },
      valueGetter: (valueParams) => valueParams.row.user?.are_there_disease_in_family,
    },
    
    


    {
      field: 'disease name',
      flex: 2,
      minWidth:150,
      headerName: translate('teachers.disease_name'),
      valueGetter: (valueParams) => valueParams.row.user?.disease_name,
    },


    {
      field: 'father name',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.father_name'),
      valueGetter: (valueParams) => valueParams.row.user?.father_name,
    },


    {
      field: 'family disease note',
      flex: 2,
      minWidth:200,
      headerName: translate('teachers.family_disease_note'),
      valueGetter: (valueParams) => valueParams.row.user?.family_disease_note,
    },



    {
      field: 'identity number',
      flex: 2,
      minWidth:120,
      headerName: translate('teachers.identity_number'),
      valueGetter: (valueParams) => valueParams.row.user?.identity_number,
    },



   

    {
      field: 'is has disease',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.is_has_disease'),
      valueGetter: (valueParams) => {
        const hasDisease = valueParams.row.user?.is_has_disease;
        return hasDisease === 0 || hasDisease === "0"
          ? translate('students.yes')
          : translate('students.no');
      },
    },


    {
      field: 'is has treatment',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.is_has_treatment'),
      valueGetter: (valueParams) => {
        const hasDisease = valueParams.row.user?.is_has_treatment;
        return hasDisease === 0 || hasDisease === "0"
          ? translate('students.yes')
          : translate('students.no');
      },
    },
    

    {
      field: 'mother name',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.mother_name'),
      valueGetter: (valueParams) => valueParams.row.user?.mother_name,
    },

    {
      field: 'children count',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.children_count'),
      valueGetter: (valueParams) => valueParams.row?.children_count,
    },
    {
      field: 'phone',
      flex: 2,
      minWidth:150,
      headerName: translate('teachers.phone'),
      valueGetter: (valueParams) => valueParams.row.user?.phone,
    },
    {
      field: 'treatment name',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.treatment_name'),
      valueGetter: (valueParams) => valueParams.row.user?.treatment_name,
    },


    {
      field: 'wives count',
      flex: 2,
      minWidth:100,
      headerName: translate('teachers.wives_count'),
      valueGetter: (valueParams) => valueParams.row.user?.wives_count,
    },

    // teachers

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
          <IconButton onClick={() => push(PATH_DASHBOARD.users.teacherView(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.users.teacherModifiye(paramsCell.row.id))}>
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
      headerName: translate('teachers.teacherId'),
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('teachers.image'),
      renderCell: (cellParams) => (
        <>
          {cellParams.row?.image ? (
            <img
              src={`${imageLink}/${cellParams.row?.image}`}
              alt={cellParams.row.first_name}
              width={40}
              height={40}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <Iconify
              icon={ICONS.avatarman}
              width={40}
              height={40}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
        </>
      ),
    },

    {
      field: 'first_name',
      flex: 2,
      headerName: translate('teachers.teacher_full_name'),
      valueGetter: (valueParams) => `${valueParams.row?.first_name} ${valueParams.row?.last_name}`,
    },

    {
      field: 'email',
      flex: 2,
      headerName: translate('teachers.email'),
      valueGetter: (valueParams) => `${valueParams.row?.email} `,
    },

    {
      field: 'gender',
      flex: 2,
      headerName: translate('students.gender'),
      valueGetter: (paramsValue) => paramsValue.row?.gender,
      valueFormatter: (paramsFormatter) => {
        if (paramsFormatter.value === 'female') {
          return translate('students.female');
        }
        if (paramsFormatter.value === 'male') {
          return translate('students.male');
        }
        return paramsFormatter.value;
      },
    },

    {
      field: 'status',
      flex: 2,
      headerName: translate('teachers.status'),

      valueGetter: (valueParams) => valueParams.row?.status,
      renderCell: (valueParams) => {
        let label;
        if (valueParams.value === '1' || valueParams.value === '1') {
          label = (
            <Label color="success" sx={{ ml: 1 }}>
              {translate('teachers.active_statues')}
            </Label>
          );
        } else if (!valueParams.value) {
          label = null; // Set label to null when status is null or empty string
        } else {
          label = (
            <Label color="error" sx={{ ml: 1 }}>
              {translate('teachers.inactive_statues')}
            </Label>
          );
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ backgroundColor: valueParams.value === '1' ? 'success' : 'error' }} />
            {label}
          </div>
        );
      },
    },

    // teachers

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

  if (currentTab === 'teachers') {
    selectedColumns = columns || [];
  } else if (currentTab === 'users/pending') {
    selectedColumns = unApproaved || [];
  }

  const data =
    tableData?.data?.map((item) => ({
      ...item,
      id: item?.id,
      email: item.user?.email,
      first_name: item.user?.first_name,
      last_name: item.user?.last_name,
      status: item.user?.status,
      gender: item.user?.gender,
      image: item.user?.image,
    })) || [];
  return (
    <>
      <Head>
        <title>
          {translate('teachers.teachers')} | {translate('hudayi')}
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
                deleteFunc('teachers', params.row.id);
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
              title={translate('teachers.teacher')}
              total={teachersCount || 0}
              icon={<ComingSoonIllustration />}
            />
          </Grid>

          <Grid item xs={6} md={6}>
            <BookingWidgetSummary
              sx={{
                marginTop: '40px',
                bgcolor: '#F5F5F5',
                boxShadow: '1px 1px 7px rgba(0, 0, 0, 0.2)',
              }}
              title={translate('teachers.teacherCount')}
              total={teachersCountPending || 0}
              icon={<Pending />}
            />
          </Grid>
        </Grid>

        <CustomBreadcrumbs
          heading={translate('teachers.teachers')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('teachers.teachers'), href: PATH_DASHBOARD.users.teacherRoot },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.users.teacherModifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('teachers.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />
        {done ? (
          <Card>
            <DataGridCustom
              key={`tableData_${tableData?.data}`}
              data={tableData?.data || tableData || []}
              columns={selectedColumns}
              onRowClick={(params) => {
                push(PATH_DASHBOARD.users.teacherView(params.row.id));
              }}
              pageSize={pageSize}

              columnVisibilityModel={{
                'children count': false,
                'marital status': false,
                'are there disease in family': false,
                "birth date":false,
                "birth place":false,
                "blood type":false,
                "current address":false,
                "disease name":false,
                "family disease note":false,
                "father name":false,
                "identity number":false,
                "is approved":false,
                "is has disease":false,
                "is has treatment":false,
                "mother name":false,
                "phone":false,
                "treatment name":false,
                "wives count":false,
               
                
    
    
              }}

              onPageChange={async (newPage) => {
                const page = newPage + 1;
                setPageNumber(page);
                if (currentTab === 'users/pending') {
                  await getTeacherPending(`users/pending?page=${page}&perpage=${pageSize}`);
                } else {
                  await getTeachers(`teachers?page=${page}&perpage=${pageSize}`);
                }
              }}
              onPageSizeChange={async (newSize) => {
                setPageSize(newSize);
                if (currentTab === 'teachers') {
                  await getTeachers(`teachers?page=${pageNumber}&perpage=${newSize}`);
                } else {
                  await getTeacherPending(`users/pending?page=${pageNumber}&perpage=${newSize}`);
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
