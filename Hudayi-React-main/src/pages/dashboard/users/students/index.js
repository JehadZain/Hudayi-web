// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Typography, IconButton, Button, Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import BookingWidgetSummary from '../../../../sections/general/booking/BookingWidgetSummary';

import { CustomAvatarGroup } from '../../../../components/custom-avatar';
import Label from '../../../../components/label';

import { get, deleteFunc } from '../../../../utils/functions';
import { useSnackbar } from '../../../../components/snackbar';

import { useLocales } from '../../../../locales';
import DashboardLayout from '../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../components/settings';
import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import BackgroundIllustration from '../../../../sections/general/booking/BackgroundIllustration';
import { useBoolean } from '../../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../../components/custom-dialog';
import { imageLink } from 'src/auth/utils';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

Students.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Students() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { push } = useRouter();

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const [studentsCount, setStudentsCount] = useState(0);
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const getStudents = async (link) => {
    const students = await get(link ?? 'students', null, enqueueSnackbar);
    setTableData(students?.data?.students);
    const pagenation = { ...students?.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setStudentsCount(students.hints?.total ?? 0);
  };

  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };
  useEffect(() => {
    getStudents();
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: translate('students.studentId'),
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('students.image'),
      renderCell: (paramsCell) => {
        console.log("paramsCell.row", paramsCell.row);
        const user = paramsCell.row;
        let avatarSrc;

        if (user?.image) {
          avatarSrc = `${imageLink}/${user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.first_name}
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
      minWidth:130,

      headerName: translate('students.student_full_name'),

      valueGetter: (paramsValue) =>
        `${paramsValue.row?.first_name} ${paramsValue.row?.last_name}`,
    },

    {
      field: 'email',
      flex: 2,
      minWidth:200,
      headerName: translate('students.email'),
      valueGetter: (paramsValue) => paramsValue.row?.email,
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
      field: 'is_orphan',
      flex: 2,
      headerName: translate('students.is_orphan'),
      valueFormatter: (paramsFormatter) => {
        if (paramsFormatter.value === '1') {
          return translate('students.yes');
        }
        if (paramsFormatter.value === '0') {
          return translate('students.no');
        }
        return paramsFormatter.value;
      },
    },

    {
      field: 'status',
      flex: 2,
      headerName: translate('students.status'),
      valueGetter: (paramsValue) => paramsValue.row?.status,
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
    field: 'sessions',
    headerName: translate('students.sessionsAndAttendance'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const sessions = params.row.statistics.find(s => s.name === "Sessions")?.count || 0;
      const unattendedSessions = params.row.statistics.find(s => s.name === "Unattended Sessions")?.count || 0;
      return { attended: sessions, total: sessions + unattendedSessions };
    },
    renderCell: (params) => {
      const { attended, total } = params.value;
      return `${attended}/${total}`;
    },
  },
  {
    field: 'activities',
    headerName: translate('students.activitiesAndParticipation'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const activities = params.row.statistics.find(s => s.name === "Activities")?.count || 0;
      const unattendedActivities = params.row.statistics.find(s => s.name === "Unattended Activities")?.count || 0;
      return { attended: activities, total: activities + unattendedActivities };
    },
    renderCell: (params) => {
      const { attended, total } = params.value;
      return `${attended}/${total}`;
    },
  },
  {
    field: 'books',
    headerName: translate('students.readedBooks'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const books = params.row.statistics.find(s => s.name === "Books")?.count || 0;
      return books;
    },
    renderCell: (params) => {
      return params.value;
    },
  },
  {
    field: 'personalInterviews',
    headerName: translate('students.personalInterviews'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const personalInterviews = params.row.statistics.find(s => s.name === "Personal Interviews")?.count || 0;
      return personalInterviews;
    },
    renderCell: (params) => {
      return params.value;
    },
  },
  {
    field: 'faceToFaceQuiz',
    headerName: translate('students.faceToFaceQuiz'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const faceToFaceQuiz = params.row.statistics.find(s => s.name === "Face-to-Face Quiz")?.count || 0;
      return faceToFaceQuiz;
    },
    renderCell: (params) => {
      return params.value;
    },
  },
  {
    field: 'absenceQuiz',
    headerName: translate('students.absenceQuiz'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const absenceQuiz = params.row.statistics.find(s => s.name === "Absence Quiz")?.count || 0;
      return absenceQuiz;
    },
    renderCell: (params) => {
      return params.value;
    },
  },
  {
    field: 'correctArabicReadingQuiz',
    headerName: translate('students.correctArabicReadingQuiz'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const correctArabicReadingQuiz = params.row.statistics.find(s => s.name === "Correct Arabic Reading Quiz")?.count || 0;
      return correctArabicReadingQuiz;
    },
    renderCell: (params) => {
      return params.value;
    },
  },
  {
    field: 'quizzes',
    headerName: translate('students.quizzes'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const quizzes = params.row.statistics.find(s => s.name === "Quizzes")?.count || 0;
      return quizzes;
    },
    renderCell: (params) => {
      return params.value;
    },
  },
  {
    field: 'notes',
    headerName: translate('students.notes'),
    flex: 2,
    minWidth:100,
    valueGetter: (params) => {
      const notes = params.row.statistics.find(s => s.name === "Notes")?.count || 0;
      return notes;
    },
    renderCell: (params) => {
      return params.value;
    },
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
    valueGetter: (valueParams) => valueParams.row?.are_there_disease_in_family,
  },
  

  

   {
        field: 'birth date',
        flex: 2,
        minWidth:100,
        headerName: translate('students.birth_date'),
        valueGetter: (valueParams) => {
          const birthDate = valueParams.row?.birth_date;
          return birthDate ? format(new Date(birthDate), 'yyyy-MM-dd') : '';
        },
      },

  {
    field: 'birth place',
    flex: 2,
    minWidth:100,
    headerName: translate('students.birth_place'),
    valueGetter: (paramsValue) => paramsValue.row?.birth_place,
  },

  {
    field: 'blood type',
    flex: 2,
    minWidth:70,
    headerName: translate('students.blood_type'),
    valueGetter: (paramsValue) => paramsValue.row?.blood_type,
  },


   {
    field: 'current address',
    flex: 2,
    minWidth:100,
    headerName: translate('students.current_address'),
    valueGetter: (paramsValue) => paramsValue.row?.current_address,
  },

  {
    field: 'disease name',
    flex: 2,
    minWidth:100,
    headerName: translate('students.disease_name'),
    valueGetter: (paramsValue) => paramsValue.row?.disease_name,
  },


  {
    field: 'family disease note',
    flex: 2,
    minWidth:180,
    headerName: translate('students.family_disease_note'),
    valueGetter: (paramsValue) => paramsValue.row?.family_disease_note,
  },


  {
    field: 'family members count',
    flex: 2,
    minWidth:100,
    headerName: translate('students.family_members_count'),
    valueGetter: (paramsValue) => paramsValue.row?.family_members_count,
  },


  {
    field: 'father name',
    flex: 2,
    minWidth:100,
    headerName: translate('students.father_name'),
    valueGetter: (paramsValue) => paramsValue.row?.father_name,
  },


  {
    field: 'identity number',
    flex: 2,
    minWidth:100,
    headerName: translate('students.identity_number'),
    valueGetter: (paramsValue) => paramsValue.row?.identity_number,
  },


 

  {
    field: 'is has disease',
    flex: 2,
    minWidth:100,
    headerName: translate('students.is_has_disease'),
    valueFormatter: (paramsFormatter) => {
      if (paramsFormatter.value === '1') {
        return translate('students.yes');
      }
      if (paramsFormatter.value === '0') {
        return translate('students.no');
      }
      return paramsFormatter.value;
    },
  },


  {
    field: 'is has treatment',
    flex: 2,
    minWidth:100,
    headerName: translate('students.is_has_treatment'),
    valueFormatter: (paramsFormatter) => {
      if (paramsFormatter.value === '1') {
        return translate('students.yes');
      }
      if (paramsFormatter.value === '0') {
        return translate('students.no');
      }
      return paramsFormatter.value;
    },
  },

  {
    field: 'treatment name',
    flex: 2,
    minWidth:100,
    headerName: translate('students.treatment_name'),
    valueGetter: (paramsValue) => paramsValue.row?.treatment_name,
  },

  {
    field: 'mother name',
    flex: 2,
    minWidth:100,
    headerName: translate('students.mother_name'),
    valueGetter: (paramsValue) => paramsValue.row?.mother_name,
  },



  {
    field: 'note',
    flex: 2,
    minWidth:100,
    headerName: translate('students.note'),
    valueGetter: (paramsValue) => paramsValue.row?.note,
  },


  {
    field: 'parent phone',
    flex: 2,
    minWidth:100,
    headerName: translate('students.parent_phone'),
    valueGetter: (paramsValue) => paramsValue.row?.parent_phone,
  },



  {
    field: 'parent work',
    flex: 2,
    minWidth:100,
    headerName: translate('students.parent_work'),
    valueFormatter: (paramsFormatter) => {
      if (paramsFormatter.value === 'null' || null) {
        return translate('students.null');
      }
      
      return paramsFormatter.value;
    },
  },


  {
    field: 'phone',
    flex: 2,
    minWidth:100,
    headerName: translate('students.phone'),
    valueGetter: (paramsValue) => paramsValue.row?.phone,
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
          <IconButton onClick={() => push(PATH_DASHBOARD.users.studentView(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.users.studentModifiye(paramsCell.row.id))}>
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
          {translate('students.students')} | {translate('hudayi')}
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
                deleteFunc('students', params.row.id);
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
              title={translate('students.student')}
              total={studentsCount === 0 ? 0 : studentsCount || 0}
              icon={<BackgroundIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          heading={translate('students.students')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('students.students'), href: PATH_DASHBOARD.users.studentRoot },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.users.studentModifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('students.add')}
          //   </Button>
          // }
          sx={{ marginTop: '30px' }}
        />
        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
           onRowClick={(params) => {
            console.log("clicked3", params);
             push(PATH_DASHBOARD.users.studentView(params.row.id));
            }}
          pageSize={pageSize}
          columnVisibilityModel={{
            "are there disease in family":false,
            'disease inside the family': false,
            'birth date': false,
            'birth place': false,
            "blood type":false,
            "current address":false,
            "disease name":false,
            "family disease note":false,
            "family members count":false,
            "father name":false,
            "identity number":false,
            
            "is approved":false,
            "is has disease":false,
            "is has treatment":false,
            "mother name":false,
            "note":false,
            "parent phone":false,
            "parent work":false,
            "phone":false,
            "property id":false,
            "treatment name":false,
            "user id":false,
            "username":false,
            "birth place":false,
            


          }}
          
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getStudents(`students?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getStudents(`students?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate.total}
          isPagination
        />
      </Container>
    </>
  );
}