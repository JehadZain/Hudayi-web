// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import DashboardLayout from '../../../../../layouts/dashboard';
import StudentNewEditForm from '../../../../../sections/users/StudentNewEditForm';

import { useSettingsContext } from '../../../../../components/settings';
import localStorageAvailable from '../../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { useLocales } from '../../../../../locales';
import { get } from '../../../../../utils/functions';
// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const { translate } = useLocales();
  const [data, setData] = useState([]);

  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getstudent = async () => {
      const student = await get('students', id);
      if (isMounted) {
        setData(student.data);
      }
    };

    getstudent();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title>
          {' '}
          {translate('students.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('students.students'), href: PATH_DASHBOARD.users.studentRoot },
            { name: translate('students.add'), href: PATH_DASHBOARD.users.studentModifiye('new') },
          ]}
        />
        <StudentNewEditForm isEdit={id !== 'new' } currentUser={data} />
      </Container>
    </>
  );
}
