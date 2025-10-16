import PropTypes from 'prop-types';
import { useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
import { useRouter } from 'next/router';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../routes/paths';

// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { TableHeadCustom } from '../../components/table';
import MenuPopover from '../../components/menu-popover';

// ----------------------------------------------------------------------

BookingDetails.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  tableData: PropTypes.array.isRequired,
  tableLabels: PropTypes.array.isRequired,
};

export default function BookingDetails({ title, subheader, tableLabels, tableData, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <BookingDetailsRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon='eva:arrow-ios-forward-fill' />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

BookingDetailsRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
    avatar: PropTypes.string,
    checkIn: PropTypes.instanceOf(Date),
    checkOut: PropTypes.instanceOf(Date),
    booker: PropTypes.string, // Add prop validation for 'booker' property
    phone: PropTypes.string, // Add prop validation for 'phone' property
    hotel: PropTypes.shape({
      name: PropTypes.string, // Add prop validation for 'name' property inside 'hotel' object
    }),
    price: PropTypes.string, // Add prop validation for 'price' property
    status: PropTypes.string,
  }),
};

function BookingDetailsRow({ row }) {
  const theme = useTheme();
  const { pathname, push } = useRouter();
  const isLight = theme.palette.mode === 'light';

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleDownload = () => {
    handleCloseMenu();
  };

  const handlePrint = () => {
    handleCloseMenu();
  };

  const handleShare = () => {
    handleCloseMenu();
  };

  const handleDelete = () => {
    handleCloseMenu();
  };
  const handleEditRow = (id) => {
    push(PATH_DASHBOARD.general.editBooking(id));
  };
  return (
    <>
      <TableRow>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2">{row.booker}</Typography>
          </Stack>
        </TableCell>

        <TableCell>{format(new Date(row.checkIn), 'dd MMM yyyy')}</TableCell>

        <TableCell>{format(new Date(row.checkOut), 'dd MMM yyyy')}</TableCell>

        <TableCell>
          <Label
            variant={isLight ? 'ghost' : 'filled'}
            color={
              (row.status === 'paid' && 'success') ||
              (row.status === 'pending' && 'warning') ||
              'error'
            }
          >
            {sentenceCase(row.status || '')}
          </Label>
        </TableCell>

        <TableCell>{row.phone}</TableCell>

        <TableCell sx={{ textTransform: 'capitalize' }}>{row.hotel?.name || ''}</TableCell>
        <TableCell>{row.price || 'Not specified'}</TableCell>
        <TableCell align="right">
          <IconButton color={openMenu ? 'inherit' : 'default'} onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover open={openMenu} onOpen={handleOpenMenu} arrow="right-top" sx={{ width: 160 }}>
      <MenuItem onClick={() => handleEditRow(row.id)}>
          <Iconify icon="zmdi:edit" />
          Edit
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="eva:printer-fill" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="eva:share-fill" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
