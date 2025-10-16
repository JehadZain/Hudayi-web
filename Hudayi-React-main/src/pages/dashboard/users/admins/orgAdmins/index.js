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
// components
import { useSettingsContext } from '../../../../../components/settings';
import DataGridCustom from '../../../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../../../components/iconify';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { useBoolean } from '../../../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../../../components/custom-dialog';
import { useSnackbar } from '../../../../../components/snackbar';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

AdminsOrg.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function AdminsOrg() {
  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const getAdminsOrg = async () => {
    const adminsOrg = await get('organization/admins', null, enqueueSnackbar);
    setTableData(adminsOrg.data?.data);
  };
  useEffect(() => {
    getAdminsOrg();
  }, []);

  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
  };
  const columns = [
    {
      field: 'organization',
      flex: 2,
      headerName: translate('org_admins.organization'),
      valueGetter: (paramsValue) => paramsValue.row.organization_id,
    },

    {
      field: 'image',
      flex: 3,
      headerName: translate('property_admins.image'),
      renderCell: (paramsCell) => {
        const { user, admin } = paramsCell.row;
        let avatarSrc;

        if (admin?.user?.image) {
          avatarSrc = `${imageLink}/${admin?.user?.image}`;
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
      field: 'name',
      flex: 2,
      headerName: translate('org_admins.name'),
      valueGetter: (paramsValue) => paramsValue.row.organization?.name,
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
      flex: 2,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.orgAdmins.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.orgAdmins.modifiye(paramsCell.row.id))}>
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
          {translate('org_admins.org_admins')} | {translate('hudayi')}
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
                deleteFunc('organization/admins', params.row.id);
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
          heading={translate('org_admins.org_admins')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            {
              name: translate('org_admins.org_admins'),
              href: PATH_DASHBOARD.orgAdmins.modifiye('new'),
            },
          ]}
          // action={
          //   <Button
          //     component={NextLink}
          //     href={PATH_DASHBOARD.orgAdmins.modifiye('new')}
          //     variant="contained"
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('org_admins.add')}
          //   </Button>
          // }
        />
        <DataGridCustom data={tableData} columns={columns} />
      </Container>
    </>
  );
}
