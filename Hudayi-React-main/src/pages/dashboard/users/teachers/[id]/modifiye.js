// next
import Head from 'next/head';
import { Container, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import DashboardLayout from '../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../components/settings';
import localStorageAvailable from '../../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import TeacherNewEditForm from '../../../../../sections/users/TeacherNewEditForm';
import { useLocales } from '../../../../../locales';
import { get } from '../../../../../utils/functions';

import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const { translate } = useLocales();
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getTeacher = async () => {
      const teacher = await get('teachers', id, enqueueSnackbar);
      if (isMounted) {
        setData(teacher.data);
      }
    };

    getTeacher();

    return () => {
      isMounted = false;
    };
  }, [id]);
  return (
    <>
      <Head>
        <title> {translate('teachers.add')}| {translate('hudayi')}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('teachers.add')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name:  translate('teachers.teachers'), href: PATH_DASHBOARD.users.teacherRoot },
            { name:  translate('teachers.add'), href:  PATH_DASHBOARD.users.teacherModifiye('new')},
          ]}
        />
<TeacherNewEditForm isEdit={id !== 'new'} currentUser={data} />
      </Container>
    </>
  );
}
