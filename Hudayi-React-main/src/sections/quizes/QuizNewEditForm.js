import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider, AdapterMoment, LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';

import { useFormContext, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import moment from 'moment/moment';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, {
  convertTimeToDateTime,
  get,
  sqlTime,
  postFormData,
  put,
} from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
} from '../../components/hook-form';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

QuizNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function QuizNewEditForm({ isEdit, currentProduct }) {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizes, setQuizes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const { translate } = useLocales();

  const getTeachers = async (word) => {
    const teacher = await get(`teachers?search=${word}`, null, enqueueSnackbar);
    setTeachers(teacher?.data?.data || []);
  };

  const getStudents = async (word) => {
    const student = await get(`students?search=${word}`, null, enqueueSnackbar);
    setStudents(student?.data?.data || []);
  };
 

  const getQuizes = async () => {
    const quize = await get('quizzes', null, enqueueSnackbar);

    setQuizes(quize.data?.data);
  };
  useEffect(() => {
    getQuizes();
  }, []);
  const { push } = useRouter();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(translate('quizes.nameRequied')),
    quiz_subject: Yup.string().required(translate('quizes.quiz_subjectRequied')),
    date: Yup.string().required(translate('quizes.dateRequied')),
    quiz_type: Yup.string().required(translate('quizes.quiz_typeRequied')),
    score: Yup.string().required(translate('quizes.scoreRequied')),
    student_id: Yup.string().required(translate('quizes.student_idRequied')),
    teacher_id: Yup.string().required(translate('quizes.teacher_idRequied')),
    time: Yup.string().required(translate('quizes.timeRequied')),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      date: new Date(currentProduct?.date) || '',

      quiz_subject: currentProduct?.quiz_subject || null,
      // date: new Date(moment(currentProduct?.date, 'YYYY-MM-DD', true)) || '',
      quiz_type: currentProduct?.quiz_type || '',
      score: currentProduct?.score || '',
      time: currentProduct?.time?.split(' ')[1] || '00',
      student_id: currentProduct?.student_id || null,
      teacher_id: currentProduct?.teacher_id || null,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });
  const styles = `
  input[type="time"]::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 75px;
  }
`;
  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);
  const {
    query: { id },
  } = useRouter();
  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);

      const time = await convertTimeToDateTime(data.time);

      const quize = isEdit
        ? await put(
            `quizzes/${id}?name=${data.name}&quiz_subject=${data.quiz_subject}&date=${sqlTime(
              data.date
            )}&time=${`2023:02:01 ${data.time}:00`}&quiz_type=${data.quiz_type}&score=${
              data.score
            }&student_id=${data.student_id}&teacher_id=${data.teacher_id}`
          )
        : await postFormData('quizzes', {
            id: null,
            ...data,
            date: sqlTime(data.date),
            time: `2023:02:01 ${data.time}:00`,
          });

      if (quize.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.quizes.root);
      } else if (quize.hints['0']?.includes('Duplicate')) {
        enqueueSnackbar('تأكد من أن جميع البيانات نادرة', { variant: 'error' });
      } else {
        const error = quize.hints['0'];
        enqueueSnackbar(error, { variant: 'error' });
      }

      setIsLoading(false);


     
    } catch (error) {
      console.error(error);
    }
  };

  const uniqueQuizes = quizes
    ? quizes.filter(
        (quiz, index, self) => index === self.findIndex((q) => q.quiz_type === quiz.quiz_type)
      )
    : [];

  const uniqueQuizesSubject = quizes
    ? quizes.filter(
        (quizSubject, index, self) =>
          index === self.findIndex((q) => q.quiz_subject === quizSubject.quiz_subject)
      )
    : [];
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
     
        <Grid display="flex" container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
               
               
               <RHFAutocomplete
                name="student_id"
                
                label={translate('students.students')}
                onChange={(event, newValue) => setValue('student_id', newValue?.id)}
                options={students}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.user?.first_name) {
                    return `${option?.user?.first_name} ${option?.user?.last_name} `;
                  }
                  if (isEdit && students.length === 0) {
                    return `${currentProduct?.student?.user?.first_name} ${currentProduct?.student?.user?.last_name}`;
                  } 
                    const foundStudents = students.find((e) => e.id === option);
                    if (foundStudents && foundStudents?.user?.first_name) {
                      return `${foundStudents?.user.first_name} ${foundStudents?.user.last_name}`;
                    }
                  

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getStudents(event.target.value);
                }}
              />

<RHFAutocomplete
                name="teacher_id"
                label={translate('teachers.teachers')}
                onChange={(event, newValue) => setValue('teacher_id', newValue?.id)}
                options={teachers}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.user?.first_name) {
                    return `${option?.user?.first_name} ${option?.user?.last_name} `;
                  }
                  if (isEdit && teachers.length === 0) {
                    return `${currentProduct?.teacher?.user?.first_name} ${currentProduct?.teacher?.user?.last_name}`;
                  } 
                    const foundTeacher = teachers.find((e) => e.id === option);
                    if (foundTeacher && foundTeacher?.teacher?.user?.first_name && foundTeacher?.teacher?.user?.last_name) {
                      return `${foundTeacher?.teacher?.user?.first_name} ${foundTeacher?.teacher?.user?.last_name}`;
                    }
                  

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getTeachers(event.target.value);
                }}
              />

                <RHFTextField name="name" label={translate('quizes.name')} />

                <RHFAutocomplete
                  name="quiz_subject"
                  label={translate('quizes.quiz_subject')}
                  onChange={(event, newValue) => setValue('quiz_subject', newValue.quiz_subject)}
                  options={uniqueQuizesSubject}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => {
                    if (option?.quiz_subject) {
                      return option.quiz_subject; // Return the string representation of quiz_type
                    }

                    const foundStudent = quizes.find((e) => e.quiz_subject === option);
                    if (foundStudent) {
                      return foundStudent.quiz_subject; // Return the string representation of quiz_type
                    }

                    return '';
                  }}
                />

                <RHFAutocomplete
                  name="quiz_type"
                  label={translate('quizes.quiz_type')}
                  onChange={(event, newValue) => setValue('quiz_type', newValue.quiz_type)}
                  options={uniqueQuizes}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => {
                    if (option?.quiz_type) {
                      return option.quiz_type; // Return the string representation of quiz_type
                    }

                    const foundStudent = quizes.find((e) => e.quiz_type === option);
                    if (foundStudent) {
                      return foundStudent.quiz_type; // Return the string representation of quiz_type
                    }

                    return '';
                  }}
                />

                <RHFTextField type="number" name="score" label={translate('quizes.score')} />

                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label={translate('interviews.date')}
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <div>
                  <style>{styles}</style>
                  <RHFTextField type="time" name="time" label={translate('sessions.start_at')} />
                </div>
              </Box>

              <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? translate('quizes.add') : translate('saveChanges')}
                </LoadingButton>

                <Button
                  variant="contained"
                  onClick={() => {
                    push(PATH_DASHBOARD.quizes.root);
                  }}
                  sx={{
                    marginLeft: 2,

                    // Change text color to error color
                    backgroundColor: 'error.dark', // Set background color to error color
                    '&:hover': {
                      backgroundColor: '#8e0502', // Set the same background color on hover
                    },
                  }}
                >
                  {translate('cancel')}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      
    </FormProvider>
  );
}
