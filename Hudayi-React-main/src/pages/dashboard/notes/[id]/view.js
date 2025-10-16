import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
import { useRouter } from 'next/router';

import DataGridCustom from '../../../../sections/general/data-grid/DataGridCustom';

import { PATH_DASHBOARD } from '../../../../routes/paths';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
import Label from '../../../../components/label'

// _mock_
import {
  _userAbout,
  
} from '../../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Iconify from '../../../../components/iconify';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
// sections
import {
 
  ProfileCover,
  
 
} from '../../../../sections/profile';
import ProfileAbout from '../../../../sections/profile/home/ProfileAbout'
import { useLocales } from '../../../../locales';
import { get } from '../../../../utils/functions';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

UserProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([]);
  const { push } = useRouter();
  const [searchFriends, setSearchFriends] = useState('');
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getstudent = async () => {
      const note = await get('notes', id, enqueueSnackbar);
      if (isMounted) {
        setData(note.data);
      }
    };

    getstudent();

    return () => {
      isMounted = false;
    };
  }, [id]);
 
 
  function formatTimeElapsed(updatedAt) {
    const now = new Date();
    const updatedAtDate = new Date(updatedAt);
    const elapsedMilliseconds = now - updatedAtDate;
  
    // Convert milliseconds to weeks, months, days, or years
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
    const elapsedMonths = Math.floor(elapsedDays / 30);
    const elapsedYears = Math.floor(elapsedDays / 365);
  
    if (elapsedYears > 0) {
      return `${elapsedYears} ${translate('students.year', { count: elapsedYears })} ${translate('time.ago')}`;
    }  if (elapsedMonths > 0) {
      return `${elapsedMonths} ${translate('students.month', { count: elapsedMonths })} ${translate('time.ago')}`;
    }  if (elapsedDays > 0) {
      return `${elapsedDays} ${translate('students.days_ago')}`;
    } 
      return translate('students.less_than_a_day_ago');
   
  }
  
  const columnsNotes = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('students.note_id'),
    },

    {
      field: 'student_id',
      flex: 2,
      headerName: translate('students.student_id'),
    },

    
    {
      field: 'date',
      flex: 2,
      headerName: translate('students.interview_date'),
    },

    {
      field: 'content',
      flex: 5,
      headerName: translate('students.note_content'),
    },

    {
      field: 'updated_at',
      flex: 2,
      headerName: translate('students.updated_at'),
      valueGetter: (params) => formatTimeElapsed(params.row.updated_at),

      
    },

    {
      field: 'teacher_user_full_name',
      flex: 2,
      headerName: translate('students.teacher_full_name'),
      valueGetter: (params) => {
        const { teacher } = params.row;
        return `${teacher?.user?.first_name} ${teacher?.user?.last_name}`;
      }
    }
   
  ];
  
 

 
  const iconify = (name) => <Iconify icon={name} />;

  


 

 
  return (
    <>
      <Head>
        <title> {translate('students.students')}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        
        <CustomBreadcrumbs
          heading={translate('students.profile')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('students.students'), href: PATH_DASHBOARD.users.studentRoot },
            { name: data?.user?.first_name },
          ]}
        />
       <DataGridCustom data={data?.notes || []} columns={columnsNotes} />,

       

      </Container>
    </>
  );
}



