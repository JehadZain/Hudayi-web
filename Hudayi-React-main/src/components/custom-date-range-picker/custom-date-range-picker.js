import PropTypes from 'prop-types';
// @mui
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';

// hooks
import { useResponsive } from '../../hooks/use-responsive';
import { filterDate, sqlTime } from '../../utils/functions';
import { useLocales } from '../../locales';

// ----------------------------------------------------------------------

export default function CustomDateRangePicker({
  title = 'أختر نطاق التاريخ',
  variant = 'الإدخال',
  //
  startDate,
  endDate,
  //
  onChangeStartDate,
  onChangeEndDate,
  setCurrentFilter,
  //
  open,
  onClose,
  //
  error,
  getAnalytics,
}) {
  const mdUp = useResponsive('up', 'md');
  const { translate } = useLocales();
  title = translate('titleAnalytics');
  const isCalendarView = variant === 'calendar';

  return (
    <Dialog
      fullWidth
      maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(isCalendarView && {
            maxWidth: 720,
          }),
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent
        sx={{
          ...(isCalendarView &&
            mdUp && {
              overflow: 'unset',
            }),
        }}
      >
        <Stack
          justifyContent="center"
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && mdUp ? 'row' : 'column'}
          sx={{ pt: 1 }}
        >
          {isCalendarView ? (
            <>
              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <DateCalendar value={startDate} onChange={onChangeStartDate} />
              </Paper>

              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <DateCalendar value={endDate} onChange={onChangeEndDate} />
              </Paper>
            </>
          ) : (
            <>
              <DatePicker
                maxDate={new Date()}
                label={translate('starting_date')}
                value={startDate}
                onChange={onChangeStartDate}
              />

              <DatePicker
                label={translate('ending_date')}
                value={endDate}
                maxDate={new Date()}
                minDate={startDate}
                onChange={(date) => {
                  onChangeEndDate(date);
                  setCurrentFilter('onChangeEndDate');
                }}
              />
            </>
          )}
        </Stack>

        {error && (
          <FormHelperText error sx={{ px: 2 }}>
            {translate('ending_date_place')}
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            onClose();
            setCurrentFilter(null);
          }}
        >
          {translate('cancel')}
        </Button>

        <Button
          disabled={error}
          variant="contained"
          onClick={() => {
            getAnalytics('custom', filterDate(startDate), filterDate(endDate));
            onClose();
          }}
        >
          {translate('apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CustomDateRangePicker.propTypes = {
  error: PropTypes.bool,
  onChangeEndDate: PropTypes.func,
  setCurrentFilter: PropTypes.func,
  onChangeStartDate: PropTypes.func,
  getAnalytics: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['input', 'calendar']),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
};
