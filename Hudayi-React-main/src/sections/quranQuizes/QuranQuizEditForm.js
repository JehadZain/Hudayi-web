import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';
import MenuItem from '@mui/material/MenuItem';

import { useForm, Controller } from 'react-hook-form';
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
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import moment from 'moment/moment';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, {
  convertTimeToDateTime,
  get,
  postFormData,
  put,
  sqlTime,
} from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from '../../components/hook-form';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

QuranQuizEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentItem: PropTypes.object,
};

export default function QuranQuizEditForm({ isEdit, currentItem }) {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const {
    query: { id },
  } = useRouter();
  const { translate } = useLocales();

  const getTeachers = async (word) => {
    const teacher = await get(`teachers?search=${word}`, null, enqueueSnackbar);
    setTeachers(teacher?.data?.data || []);
  };

  const getStudents = async (word) => {
    const student = await get(`students?search=${word}`, null, enqueueSnackbar);
    setStudents(student?.data?.data || []);
  };

  const { push } = useRouter();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(translate('quranQuizes.nameRequied')),
    student_id: Yup.string().required(translate('quranQuizes.student_idRequied')),
    teacher_id: Yup.string().required(translate('quranQuizes.teacher_idRequied')),
    score: Yup.string().required(translate('quranQuizes.scoreRequied')),
    page: Yup.mixed().required(translate('quranQuizes.pageRequied')),
    juz: Yup.string().required(translate('quranQuizes.juzRequied')),
    exam_type: Yup.string().required(translate('quranQuizes.exam_typeRequied')),
    date: Yup.string().required(translate('quizes.dateRequied')),
  });
  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      student_id: currentItem?.student_id || null,
      score: currentItem?.score || '',
      teacher_id: currentItem?.teacher_id || null,
      page: currentItem?.page?.split(',').map(Number) || '',
      juz: currentItem?.juz || '',
      exam_type: currentItem?.exam_type || null,
      date: new Date(currentItem?.date) || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    getValues,
    control,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentItem) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentItem]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);
      const quranquizes = isEdit
        ? await put(
            `quran-quizzes/${id}?name=${data.name}&juz=${data.juz}&page=${data.page}&date=${sqlTime(
              data.date
            )}&score=${data.score}&student_id=${data.student_id}&teacher_id=${
              data.teacher_id
            }&exam_type=${data.exam_type}`
          )
        : await post('quran-quizzes', {
            id: null,
            ...data,
            date: sqlTime(data.date),
          });
      if (quranquizes.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.quranQuizes.root);
      } else if (quranquizes.hints['0']?.includes('Duplicate')) {
        enqueueSnackbar(translate('data_unique'), { variant: 'error' });
      } else {
        const error = quranquizes.hints['0'];
        enqueueSnackbar(error, { variant: 'error' });
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

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
                    return `${currentItem?.student?.user?.first_name} ${currentItem?.student?.user?.last_name}`;
                  }

                  const foundStudents = students.find((e) => e.id === option);
                  if (foundStudents && foundStudents?.user?.first_name) {
                    return `${foundStudents?.user.first_name} ${foundStudents?.user.last_name}`;
                  }

                  return ''; // This 'return' statement is sufficient for the default case.
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
                    return `${currentItem?.teacher?.user?.first_name} ${currentItem?.teacher?.user?.last_name}`;
                  }

                  const foundTeachers = teachers.find((e) => e.id === option);
                  if (foundTeachers && foundTeachers?.user?.first_name) {
                    return `${foundTeachers?.user.first_name} ${foundTeachers?.user.last_name}`;
                  }

                  return ''; // This 'return' statement is sufficient for the default case.
                }}
                textFieldOnChange={(event) => {
                  getTeachers(event.target.value);
                }}
              />
              <RHFTextField name="name" label={translate('quranQuizes.name')} />
              <RHFTextField type="number" name="juz" label={translate('quranQuizes.juz')} />
              <RHFTextField type="string" name="page" label={translate('quranQuizes.page')} />
              {(currentItem?.exam_type != null || !isEdit) && (
                <RHFSelect
                  fullWidth
                  value={currentItem?.exam_type}
                  name="exam_type"
                  label={translate('quranQuizes.exam_type')}
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {[
                    { value: 'حاضر', label: translate('quranQuizes.students_present') },
                    { value: 'غائب', label: translate('quranQuizes.students_absent') },
                  ].map((option) => (
                    <MenuItem key={option} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              )}
              <RHFTextField type="number" name="score" label={translate('quranQuizes.score')} />
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
            </Box>

            <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('quranQuizes.add') : translate('saveChanges')}
              </LoadingButton>
              <Button
                variant="contained"
                onClick={() => {
                  push(PATH_DASHBOARD.quranQuizes.root);
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
