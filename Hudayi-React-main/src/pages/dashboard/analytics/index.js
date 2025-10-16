// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Card, CircularProgress, Stack, Divider, Typography, Button, Autocomplete } from '@mui/material';
import Head from 'next/head';

// layouts
import { useEffect, useState } from 'react';
import { useLocales } from '../../../locales';

import {
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
  _analyticPost,
  _analyticOrderTimeline,
  _bookingsOverview,
  _bookingReview,
} from '../../../_mock';
import {
  AppWelcome,
  AppCurrentDownload,
 
  AppTopInstalledCountries,
  AppTopRelated,
  BookingCheckInWidgets,
  BookingCustomerReviews,
 
  BookingRoomAvailable,

  EcommerceLatestProducts,
  EcommerceNewProducts,
  EcommerceSalesOverview,
  BankingExpensesCategories,
} from '../../../sections/analytics';
// components
import Page from '../../../components/Page';
// sections
import {


 


  AnalyticsWidgetSummary,
} from '../../../sections/general/analytics';
import { SeoIllustration } from '../../../assets';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DashboardLayout from '../../../layouts/dashboard';
import { useSettingsContext } from '../../../components/settings';
import { get, sqlTime } from '../../../utils/functions';
import { useAuthContext } from '../../../auth/useAuthContext';
import { useDateRangePicker } from '../../../components/date-range-picker';
import CustomDateRangePicker from '../../../components/custom-date-range-picker/custom-date-range-picker';
import { fDate } from '../../../utils/formatTime';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import { useSnackbar } from 'notistack';
import { BookingIllustration, CheckInIllustration, ComingSoonIllustration, MotivationIllustration, OrderCompleteIllustration } from 'src/assets/illustrations';
import useResponsive from 'src/hooks/useResponsive';
import PropertyAutocomplete from './PropertyAutocomplete';
import { getBranchAnalytics, getOneBranchAnalytics } from 'src/utils/excelExport';

// ----------------------------------------------------------------------
GeneralAnalyticsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAnalyticsPage() {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState([]);
  const [topAnalytics, setTopAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('');
  const [selectedProperty, setSelectedProperty] = useState();
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const title = translate('Hello_Again');
  const translatedTitle = typeof title === 'string' ? translate(title) : title;
  const [properties, setProperties] = useState([]);
  const getProperties = async () => {
    const proprty = await get('properties?perpage=1000', null, enqueueSnackbar);
    setProperties(proprty.data?.data);
  };
  const getAnalytics = async (type, date, endDate) => {
    // If either date is null, set default period of 1 month
    // if (!date || !endDate) {
    //   endDate = new Date();
    //   date = new Date();
    //   date.setMonth(date.getMonth() - 1);
    // }
    
    // Format dates to match your API's expected format
    // Assuming your API expects dates in YYYY-MM-DD format
 //   const formatDate = (d) => d.toISOString().split('T')[0];
    
    const formattedDate = date;
    const formattedEndDate = endDate;
    
    const analytic = await get(
      `analytics/general-counts/${type}/${formattedDate}/${formattedEndDate}`,
      null,
      enqueueSnackbar
    );
    
    setAnalytics(analytic.data);
  };

  const getTopAnalytics = async (type, date, endDate) => {
    // Create an AbortController to handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 99000000); // 30 second timeout

    try {
      setIsLoading(true);
      const link = date === null && endDate === null
        ? `analytics/top-students/${type}/${null}/${null}`
        : `analytics/top-students/${type}/${date}/${endDate}`;
      
      // Add the signal to the get request
      const analytic = await Promise.race([
        get(link, { signal: controller.signal }, enqueueSnackbar),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 99000000)
        )
      ]);

      // Clear the timeout since request completed
      clearTimeout(timeoutId);

      console.log("analytic:", analytic);
      
      if (!analytic) {
        throw new Error('No data received');
      }

      setTopAnalytics(analytic?.data || []);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      
      // Handle different types of errors
      let errorMessage = 'Failed to fetch analytics data';
      
      if (error.name === 'AbortError' || error.message === 'Request timeout') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
      setTopAnalytics([]);
    } finally {
      // Cleanup
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProperties();
    getAnalytics('all');
  }, []);

  const formatDate = (date) => {
    if (!date) return null;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  const getAnalytic = (analyticx) => {
    const foundAnalytic = analytics?.find((analytic) => analytic.name === analyticx);
    return foundAnalytic?.count || 0;
  };

  const getTopAnalytic = (analyticx) => {
   try {
     const foundAnalytic = topAnalytics[analyticx]||"";
     return foundAnalytic || [];
   } catch (error) {
    return [];
   }
  };
  const isDesktop = useResponsive('up', 'sm');
  const rangeCalendarPicker = useDateRangePicker(new Date(), null);
  const rangeCalendarPicker2 = useDateRangePicker(new Date(), null);
  const rangeCalendarPicker3 = useDateRangePicker(new Date(), null);
  
  return (
    <>
      <Head>
        <title>
          {translate('area.areas')} | {translate('hudayi')}
        </title>
      </Head>

     {isLoading ? <LoadingScreen/>  : <Container style={{'paddingTop':'40px'}} maxWidth={themeStretch === true ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
        <AppWelcome
          title={`${translatedTitle} ${user?.first_name || ''} ${user?.last_name || ''}`.trim()}
              style={{ height: '300px' }}
              description=""
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>
          <CustomDateRangePicker
            variant={translate('calendar')}
            open={rangeCalendarPicker.open}
            startDate={rangeCalendarPicker.startDate}
            endDate={rangeCalendarPicker.endDate}
            onChangeStartDate={rangeCalendarPicker.onChangeStartDate}
            setCurrentFilter={setCurrentFilter}
            onChangeEndDate={rangeCalendarPicker.onChangeEndDate}
            getAnalytics={getAnalytics}
            onClose={rangeCalendarPicker.onClose}
            error={rangeCalendarPicker.error}
          />

          <CustomDateRangePicker
            variant={translate('calendar')}
            open={rangeCalendarPicker2.open}
            startDate={rangeCalendarPicker2.startDate}
            endDate={rangeCalendarPicker2.endDate}
            onChangeStartDate={rangeCalendarPicker2.onChangeStartDate}
            setCurrentFilter={setCurrentFilter}
            onChangeEndDate={rangeCalendarPicker2.onChangeEndDate}
            getAnalytics={getAnalytics}
            onClose={rangeCalendarPicker2.onClose}
            error={rangeCalendarPicker2.error}
          />

          <CustomDateRangePicker
            variant={translate('calendar')}
            open={rangeCalendarPicker3.open}
            startDate={rangeCalendarPicker3.startDate}
            endDate={rangeCalendarPicker3.endDate}
            onChangeStartDate={rangeCalendarPicker3.onChangeStartDate}
            setCurrentFilter={setCurrentFilter}
            onChangeEndDate={rangeCalendarPicker3.onChangeEndDate}
            getAnalytics={getAnalytics}
            onClose={rangeCalendarPicker3.onClose}
            error={rangeCalendarPicker3.error}
          />
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={8}>
                  <Card sx={{p:2, px:4}}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      divider={
                        <Divider
                          orientation={isDesktop ? 'vertical' : 'horizontal'}
                          flexItem
                          sx={{ borderStyle: 'dashed' }}
                        />
                      }
                    >
                      <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={3}
                          sx={{ width: 1, py: 5 }}
                        >
                          <div>
                            <Typography variant="h4" sx={{ py:2,  px: 10 }}>
                              {translate("exportExcelFile")}
                            </Typography>

                            <Stack  direction="row"
                              alignItems="center"
                              justifyContent="center"
                              spacing={3}>
                              <DatePicker
                                maxDate={new Date()}
                                label={translate('starting_date')}
                                value={rangeCalendarPicker2.startDate}
                                onChange={rangeCalendarPicker2.onChangeStartDate}
                              />

                              <DatePicker
                                label={translate('ending_date')}
                                value={rangeCalendarPicker2.endDate}
                                maxDate={new Date()}
                                minDate={rangeCalendarPicker2.startDate}
                                onChange={(newValue) => {
                                  rangeCalendarPicker2.onChangeEndDate(newValue);
                                  
                                }}
                              />
                            </Stack>
                            &nbsp;
                            <Button
                              fullWidth
                              color="success"
                              variant="contained"
                              onClick={() => {
                                if (rangeCalendarPicker2.startDate && rangeCalendarPicker2.endDate) {
                                  getBranchAnalytics(
                                    formatDate(rangeCalendarPicker2.startDate), 
                                    formatDate(rangeCalendarPicker2.endDate),setIsLoading, enqueueSnackbar
                                  );
                                }else{
                                  enqueueSnackbar("الرجاء", { variant: 'error' });
                                }
                              }}
                            >
                              {translate("export_to_excel")}
                            </Button>
                          </div>                     
                        </Stack>
                    </Stack>
                  </Card>
                  <Card sx={{p:2, px:4}}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      divider={
                        <Divider
                          orientation={isDesktop ? 'vertical' : 'horizontal'}
                          flexItem
                          sx={{ borderStyle: 'dashed' }}
                        />
                      }
                    >
                      <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={3}
                          sx={{ width: 1, py: 5 }}
                        >
                          <div>
                            <Typography variant="h4" sx={{ py:2,  px: 10 }}>
                              {translate("exportExcelFileProperty")}
                            </Typography>

                            <Stack  direction="row"
                              alignItems="center"
                              justifyContent="center"
                              spacing={3}>
                              <DatePicker
                                maxDate={new Date()}
                                label={translate('starting_date')}
                                value={rangeCalendarPicker3.startDate}
                                onChange={rangeCalendarPicker3.onChangeStartDate}
                              />

                              <DatePicker
                                label={translate('ending_date')}
                                value={rangeCalendarPicker3.endDate}
                                maxDate={new Date()}
                                minDate={rangeCalendarPicker3.startDate}
                                onChange={(newValue) => {
                                  rangeCalendarPicker3.onChangeEndDate(newValue);
                                  
                                }}
                              />
                             <PropertyAutocomplete
                                properties={properties} 
                                onChange={(selectedProperty) => {
                                  setSelectedProperty(selectedProperty?.id);
                                }}
                              />
                            </Stack>
                            &nbsp;
                            <Button
                              fullWidth
                              color="success"
                              variant="contained"
                              onClick={() => {
                                if (rangeCalendarPicker3.startDate && rangeCalendarPicker3.endDate) {
                                   getOneBranchAnalytics(formatDate(rangeCalendarPicker3.startDate), formatDate(rangeCalendarPicker3.endDate), selectedProperty, setIsLoading, enqueueSnackbar);
                                }else{
                                  enqueueSnackbar(translate('plzEnterTheWholeData'), { variant: 'error' });
                                }
                              }}
                            >
                              {translate("export_to_excel")}
                            </Button>
                          </div>                     
                        </Stack>
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('students.count')}
              total={getAnalytic('All Students')}
              icon="ph:student-fill"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('teachers.count')}
              total={getAnalytic('All Teachers')}
              color="info"
              icon="icons8:student"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('admins.count')}
              total={getAnalytic('All Admins')}
              color="warning"
              icon="clarity:administrator-solid"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title={translate('area.count')}
              total={getAnalytic('All Branches')}
              color="error"
              icon="mdi:office-building-marker"
            />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts
              title={translate('The_first_students_to__present_recite')}
              list={getTopAnalytic('face_to_face')}
            />
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts
              title={translate('The_first_students_to__absent_recite')}
              list={getTopAnalytic('absence')}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts
              title={translate('Arabic_reading')}
              list={getTopAnalytic('write_arabic_reading')}
            />
          </Grid> */}
                    <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title={translate('students.allClassRooms')}
              chart={{
                colors: [theme.palette.error.main, theme.palette.primary.main],
                series: [
                  {
                    label: translate('students.allSchools'),
                    value: getAnalytic('All Schools'),
                  },
                  {
                    label: translate('students.allMosques'),
                    value: getAnalytic('All Mosques'),
                  },
                ],
              }}
            />
          </Grid>
           <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title={translate('students.branchesAnddivisions')}
              chart={{
                colors: [theme.palette.error.main, theme.palette.primary.main],
                series: [
                  {
                    label: translate('students.branches'),
                    value: getAnalytic('School Classrooms'),
                  },
                  {
                    label: translate('students.divisions'),
                    value: getAnalytic('Mosque Classrooms'),
                  },
               
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <AppCurrentDownload
                title={translate('students.sickStudents')}
                chart={{
                  colors: [theme.palette.error.main, theme.palette.primary.main],
                  series: [
                    {
                      label: translate('students.sickStudentsCount'),
                      value: getAnalytic('All Sick Users'),
                    },
                    {
                      label: translate('students.healthyStudents'),
                      value: getAnalytic('All Healthy Users'),
                    },
                  ],
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <AppCurrentDownload
                title={translate('students.studentStatue')}
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.main],
                  series: [
                    {
                      label: translate('students.studentActive'),
                      value: getAnalytic('All Active Users'),
                    },
                    {
                      label: translate('students.studentNotActive'),
                      value: getAnalytic('All Inactive Users'),
                    },
                  ],
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <AppCurrentDownload
                title={translate('admins.adminStatus')}
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.main],
                  series: [
                    {
                      label: translate('admins.marriedAdmin_Count'),
                      value: getAnalytic('All Married Admins'),
                    },
                    {
                      label: translate('admins.unMarriedAdmin_Count'),
                      value: getAnalytic('All Single Admins'),
                    },
                    {
                      label: translate('widow'),
                      value: getAnalytic('All Widow Admins'),
                    },
                  ],
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <AppCurrentDownload
                title={translate('teachers.teachersStatus')}
                chart={{
                  colors: [theme.palette.secondary.main, theme.palette.primary.main, theme.palette.error.main],
                  series: [
                    {
                      label: translate('teachers.teacherUNApproval_count'),
                      value:  getAnalytic('All Inactive Teachers'),
                    },
                    {
                      label: translate('teachers.teacherApproval_count'),
                      value: getAnalytic('All Active Teachers'),
                    },
                    {
                      label: translate('teachers.teacherWaitingApproval_count'),
                      value: getAnalytic('All Pending Teachers'),
                    },
                  ],
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <AppCurrentDownload
                title={translate('teachers.marital_statues')}
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.main],
                  series: [
                    {
                      label: translate('teachers.married_teachers_count'),
                      value: getAnalytic('All Married Teachers'),
                    },
                    {
                      label: translate('teachers.unMarried_teachers_count'),
                      value: getAnalytic('All Single Teachers'),
                    },
                    {
                      label: translate('widow'),
                      value: getAnalytic('All Widow Teachers'),
                    },
                  ],
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title={translate('students.activeStudentCount')}
              chart={{
                colors: [theme.palette.error.main, theme.palette.primary.main],
                series: [
                  {
                    label: translate('students.inactiveStudentCount'),
                    value: getAnalytic('All Inactive Students'),
                  },
                  {
                    label: translate('students.activeStudent'),
                    value: getAnalytic('All Active Students'),
                  },
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title={translate('students.orphan')}
              chart={{
                colors: [theme.palette.error.main, theme.palette.primary.main],
                series: [
                  {
                    label: translate('students.orphan'),
                    value: getAnalytic('All Orphan Students'),
                  },
                  {
                    label: translate('students.notOrphan'),
                    value: getAnalytic('All Unorphan Students'),
                  },
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <BookingCustomerReviews
              title={translate('ShowAnalytics_according_to')}
              allOnTap={() => {
                rangeCalendarPicker.endDate = null;
                setCurrentFilter(null);
                getAnalytics('all');
              }}
              dateOnTap={rangeCalendarPicker.onOpen}
              date={
                rangeCalendarPicker.endDate == null || currentFilter === null
                  ? translate('according_to_specific_date')
                  : `${translate('from')} ${sqlTime(rangeCalendarPicker.startDate)} ${translate('from')} ${sqlTime(
                      rangeCalendarPicker.endDate
                    )}`
              }
              weeklyOnTap={() => {
                rangeCalendarPicker.endDate = null;
                setCurrentFilter(null);
                getAnalytics('week');
              }}
              monthlyOnTap={() => {
                rangeCalendarPicker.endDate = null;
                setCurrentFilter(null);
                getAnalytics('month');
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <BookingCheckInWidgets
                  chart={{
                    colors: [theme.palette.warning.main],
                    series: [
                      {
                        label: translate('area.count'),
                        percent: 0,
                        total: getAnalytic('All Branches'),
                      },
                      {
                        label: translate('properties.count'),
                        percent: 0,
                        total: getAnalytic('All Properties'),
                      },
                      {
                        label: translate('classRooms.count'),
                        percent: 0,
                        total: getAnalytic('All Class Rooms'),
                      },
                      {
                        label: translate('classRooms.unApproaved_classRooms_count'),
                        percent: 0,
                        total: getAnalytic('All Pending Class Rooms'),
                      },
                    ],
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <AppCurrentDownload
                title={translate('quiz_statistics')}
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.main],
                  series: [
                    {
                      label: translate('Face_to_Face_Quiz'),
                      value: getAnalytic('Face-to-Face-Quiz'),
                    },
                    {
                      label: translate('Absence_Quiz'),
                      value: getAnalytic('Absence Quiz'),
                    },
                  ],
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <AppCurrentDownload
                title={translate('interview_statistics')}
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.main],
                  series: [
                    {
                      label: translate('Personal_Interviews'),
                      value: getAnalytic('Personal Interviews'),
                    },
                    {
                      label: translate('Books_Interviews'),
                      value: getAnalytic('Books Interviews'),
                    },
                  ],
                }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <BookingCheckInWidgets
                  chart={{
                    colors: [theme.palette.warning.main],
                    series: [
                      {
                        label: translate('All_Sessions'),
                        percent: 0,
                        total: getAnalytic('All Sessions'),
                      },
                      {
                        label: translate('All_Quizzes'),
                        percent: 0,
                        total: getAnalytic('All Quizzes'),
                      },

                      {
                        label: translate('all_Activities'),
                        percent: 0,
                        total: getAnalytic('Activities'),
                      },
                      {
                        label: translate('All_Quran_Quizzes'),
                        percent: 0,
                        total: getAnalytic('All Quran Quizzes'),
                      },
                    ],
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} md={12} lg={12}>
            <Card>
              <EcommerceSalesOverview title="Sales Overview" data={_ecommerceSalesOverview} />
            </Card>
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <EcommerceLatestProducts title="Latest Products" list={_ecommerceLatestProducts} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsNewsUpdate title="News Update" list={_analyticPost} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <BookingTotalIncomes
                  total={18765}
                  percent={2.6}
                  chart={{
                    series: [111, 136, 76, 108, 74, 54, 57, 84],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <BookingBookedRoom title="Booked Room" data={_bookingsOverview} />
              </Grid>

              <Grid item xs={12} md={12}>
                <BookingCheckInWidgets
                  chart={{
                    colors: [theme.palette.warning.main],
                    series: [
                      { label: 'Check In', percent: 72, total: 38566 },
                      { label: 'Check Out', percent: 64, total: 18472 },
                    ],
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingRoomAvailable
              title="Room Available"
              chart={{
                series: [
                  { label: 'Sold out', value: 120 },
                  { label: 'Available', value: 66 },
                ],
              }}
            />
          </Grid> */}
        </Grid>
      </Container>}
    </>
  );
}
