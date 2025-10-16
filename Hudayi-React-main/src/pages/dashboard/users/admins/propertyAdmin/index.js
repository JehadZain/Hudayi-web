// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Typography, IconButton, Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { get, deleteFunc } from '../../../../../utils/functions';
// layouts
import { useLocales } from '../../../../../locales';
import DashboardLayout from '../../../../../layouts/dashboard';
import { useSnackbar } from '../../../../../components/snackbar';

import { useSettingsContext } from '../../../../../components/settings';
import DataGridCustom from '../../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../../components/iconify';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { useBoolean } from '../../../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../../../components/custom-dialog';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

PropertyAdmin.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PropertyAdmin() {
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };
  const getpropertyAdmin = async () => {
    const propertyAdmin = await get('property/admins', null, enqueueSnackbar);
    setTableData(propertyAdmin.data?.data);
  };
  useEffect(() => {
    getpropertyAdmin();
  }, []);

  const columns = [
    {
      field: 'id',
      flex: 2,
      headerName: translate('property_admins.property_id'),
      valueGetter: (paramsValue) => paramsValue.row.property_id,
    },
    {
      field: 'image',
      flex: 2,
      headerName: translate('admins.image'),
      renderCell: (paramsCell) => {
        let avatarSrc;

        if (paramsCell.row?.admin?.user?.image) {
          avatarSrc = `${imageLink}/${paramsCell.row?.admin?.user?.image}`;
        }

        return (
          <>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={paramsCell.row?.admin?.user?.image?.first_name}
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
      field: 'name',
      flex: 2,
      headerName: translate('property_admins.property_name'),
      valueGetter: (paramsValue) => paramsValue.row.property?.name,
    },

    {
      field: 'admin_user_full_name',
      flex: 2,

      headerName: translate('admins.admin_full_name'),

      valueGetter: (paramsValue) =>
        `${paramsValue.row.admin?.user?.first_name} ${paramsValue.row.admin?.user?.last_name}`,
    },

    {
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.propertyAdmin.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton
            onClick={() => push(PATH_DASHBOARD.propertyAdmin.modifiye(paramsCell.row.id))}
          >
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
          {translate('property_admins.property_admins')} | {translate('hudayi')}
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
                deleteFunc('property/admins', params.row.id);
                setTableData(tableData.filter((e) => e.id !== params.row.id));
                confirm.onFalse();
                enqueueSnackbar(translate('deleteMessage'), { variant: 'success' });
              }}
            >
              {translate('delete')}
            </Button>
          }
        />

        <CustomBreadcrumbs
          heading={translate('property_admins.property_admins')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('property_admins.property_admins'), href: '/property_admins ' },
          ]}
          // action={
          //   <Button
          //     component={NextLink}
          //     href={PATH_DASHBOARD.propertyAdmin.modifiye('new')}
          //     variant="contained"
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('property_admins.add')}
          //   </Button>
          // }
        />
        <DataGridCustom data={tableData || []} columns={columns} />
      </Container>
    </>
  );
}
