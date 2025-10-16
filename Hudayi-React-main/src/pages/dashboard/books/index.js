// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import { Container, Typography, IconButton, Button, Image, Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';

import { get, deleteFunc } from '../../../utils/functions';
// layouts
import { useLocales } from '../../../locales';
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import DataGridCustom from '../../../sections/general/data-grid/DataGridCustom';
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../../routes/paths';
import MotivationIllustration from '../../../sections/general/booking/MotivationIllustration';
import BookingWidgetSummary from '../../../sections/general/booking/BookingWidgetSummary';
import { useBoolean } from '../../../hooks/use-boolean';
import { ConfirmDialog } from '../../../components/custom-dialog';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

Books.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Books() {
  const [tableDataPageinate, setTableDataPageinate] = useState({});
  const [pageSize, setPageSize] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState([]);
  const { translate } = useLocales();
  const { push } = useRouter();
  const [booksCount, setBooksCount] = useState(0);
  const [params, setParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const getBooks = async (link) => {
    const books = await get(link ?? 'books', null, enqueueSnackbar);
    setTableData(books.data?.data);
    const pagenation = { ...books.data };
    delete pagenation.data;
    setTableDataPageinate(pagenation);
    setBooksCount(books?.hints?.total);
  };
  useEffect(() => {
    getBooks();
  }, []);

  const ICONS = {
    book: 'fluent-emoji-flat:books',
  };
  const columns = [
    {
      field: 'id',
      headerName: translate('books.booksId'),
      flex: 2,
    },
    {
      field: 'name',
      flex: 2,
      headerName: translate('books.name'),
    },
    {
      field: 'size',
      flex: 2,
      headerName: translate('books.size'),
    },

    {
      field: 'book_type',
      flex: 2,
      headerName: translate('books.book_type'),
      renderCell: (paramsCell) => {
        let label;
        if (paramsCell.value === 'منهجي') {
          label = (
            <Label color="warning" sx={{ ml: 1 }}>
              {paramsCell.value}
            </Label>
          );
        } else if (paramsCell.value === null) {
          label = '';
        } else {
          label = (
            <Label color="info" sx={{ ml: 1 }}>
              {paramsCell.value}
            </Label>
          );
        }
        return <div style={{ display: 'flex', alignItems: 'center' }}>{label}</div>;
      },
    },

    {
      field: 'image',
      flex: 2,
      headerName: translate('teachers.image'),
      renderCell: (cellParams) => {
        const { user } = cellParams.row;

        return (
          <>
            {cellParams.row?.image ? (
              <img
                src={`${imageLink}/${cellParams.row.image}`}
                alt={cellParams.row.first_name}
                width={40}
                height={40}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Iconify
                icon={ICONS.book}
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
      field: 'action',
      headerName: ' ',
      align: 'right',
      sortable: false,
      flex: 2,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (paramsCell) => (
        <Stack direction="row">
          <IconButton onClick={() => push(PATH_DASHBOARD.books.view(paramsCell.row.id))}>
            <Iconify icon="ic:twotone-remove-red-eye" />
          </IconButton>
          {/* <IconButton onClick={() => push(PATH_DASHBOARD.books.modifiye(paramsCell.row.id))}>
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
          {translate('books.books')} | {translate('hudayi')}
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
                deleteFunc('books', params.row.id);
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
              title={translate('books.book_count')}
              total={booksCount === 0 ? 0 : booksCount || 0}
              icon={<MotivationIllustration />}
            />
          </Grid>
        </Grid>
        <CustomBreadcrumbs
          sx={{ marginTop: '30px' }}
          heading={translate('books.books')}
          links={[
            { name: translate('homePage'), href: PATH_DASHBOARD.root },
            { name: translate('books.books'), href: PATH_DASHBOARD.books.root },
          ]}
          // action={
          //   <Button
          //     variant="contained"
          //     onClick={() => {
          //       push(PATH_DASHBOARD.books.modifiye('new'));
          //     }}
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //   >
          //     {translate('books.add')}
          //   </Button>
          // }
        />
        <DataGridCustom
          key={`tableData_${tableData?.data}`}
          data={tableData?.data || tableData || []}
          columns={columns}
          onRowClick={(params) => {
            
            push(PATH_DASHBOARD.books.view(params.row.id));
          }}
          pageSize={pageSize}
          onPageChange={async (newPage) => {
            const page = newPage + 1;
            setPageNumber(page);
            await getBooks(`books?page=${page}&perpage=${pageSize}`);
          }}
          onPageSizeChange={async (newSize) => {
            setPageSize(newSize);
            await getBooks(`books?page=${pageNumber}&perpage=${newSize}`);
          }}
          page={pageNumber}
          total={tableDataPageinate.total}
          isPagination
        />
      </Container>
    </>
  );
}
