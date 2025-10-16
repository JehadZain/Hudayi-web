// next
import Head from 'next/head';
import { Container  } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import DashboardLayout from '../../../../layouts/dashboard';
import ClassRoomNewEditForm from '../../../../sections/classRoom/ClassRoomNewEditForm';
import { get } from '../../../../utils/functions';
import { useSettingsContext } from '../../../../components/settings';
import localStorageAvailable from '../../../../utils/localStorageAvailable';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useLocales } from '../../../../locales';

// ----------------------------------------------------------------------

Modifiye.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Modifiye() {
  const { themeStretch } = useSettingsContext();
  const { translate } = useLocales();
  const [data, setData] = useState([]);
  const {
    query: { id },
  } = useRouter();
  useEffect(() => {
    let isMounted = true;

    const getClassRoom = async () => {
      const classRoom = await get('class-room', id);
      if (isMounted) {
        setData(classRoom.data);
      }
    };

    getClassRoom();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <Head>
        <title>
          {translate('classRooms.add')} | {translate('hudayi')}
        </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={translate('classRooms.classRooms')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('classRooms.classRooms'), href: PATH_DASHBOARD.classRooms.root },
            {
              name: translate('classRooms.add'),
              href: PATH_DASHBOARD.classRooms.modifiye('new'),
            },
          ]}
        />
        <ClassRoomNewEditForm isEdit={id !== 'new' } currentUser={data} />
      </Container>
    </>
  );
}
