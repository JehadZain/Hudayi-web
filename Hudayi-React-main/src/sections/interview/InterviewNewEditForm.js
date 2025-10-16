import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalizationProvider, AdapterMoment, LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';
import MenuItem from '@mui/material/MenuItem';

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
import { Padding } from '@mui/icons-material';

import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFRadioGroup,
  RHFAutocomplete,
  RHFUploadAvatar,
} from '../../components/hook-form';
import { fData } from '../../utils/formatNumber';
import Label from '../../components/label';
import { PATH_DASHBOARD } from '../../routes/paths';
// components

import { get, postFormData, sqlTime } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

InterviewNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentItem: PropTypes.object,
};

export default function InterviewNewEditForm({ isEdit, currentItem }) {
  const { push } = useRouter();
  const { translate } = useLocales();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const getTeachers = async (word) => {
    const teacher = await get(`teachers?search=${word}`);
    setTeachers(teacher?.data?.data || []);
  };

  const getStudents = async (word) => {
    const student = await get(`students?search=${word}`);
    setStudents(student?.data?.data || []);
  };

  function translateValue(value) {
    if (value === 'تربوي') {
      return translate('interviews.educational');
    }
    return value;
  }
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required(translate('students.required')),
    event_place: Yup.string().required(translate('students.required')),
    date: Yup.mixed().required(translate('students.required')),
    goal: Yup.string().required(translate('students.required')),
    comment: Yup.string().required(translate('students.required')),
    type: Yup.string().required(translate('students.required')),
    student_id: Yup.string().required(translate('students.required')),
    teacher_id: Yup.string().required(translate('students.required')),
    score: Yup.string().required(translate('students.required')),

    // image: Yup.mixed().required(translate('students.required')),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || null,
      event_place: currentItem?.event_place || null,
      date: new Date(currentItem?.date) || null,
      goal: currentItem?.goal || null,
      comment: currentItem?.comment || null,
      type: currentItem?.type || null,
      student_id: currentItem?.student_id || null,
      teacher_id: currentItem?.teacher_id || null,
      score: currentItem?.score || null,
      image:
        currentItem?.image == null
          ? null
          : `${imageLink}/${currentItem?.image}`,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
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
  const {
    query: { id },
  } = useRouter();
  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);
      const interviews = await postFormData(
        isEdit ? `interviews/${id}` : 'interviews',
        { ...data, date: sqlTime(data.date) },
        data.image
      );

      if (interviews.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.interviews.root);
      } else if (interviews.hints['0']?.includes('Duplicate')) {
        enqueueSnackbar('تأكد من أن جميع البيانات نادرة', { variant: 'error' });
      } else {
        const error = interviews.hints['0'];
        enqueueSnackbar(error, { variant: 'error' });
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

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
                    return `${currentItem?.teacher?.user?.first_name} ${currentItem?.teacher?.user?.last_name}`;
                  }
                  const foundTeacher = teachers.find((e) => e.id === option);
                  if (foundTeacher && foundTeacher?.user?.first_name) {
                    return `${foundTeacher?.user.first_name} ${foundTeacher?.user.last_name}`;
                  }

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getTeachers(event.target.value);
                }}
              />
              <RHFTextField
                name="name"
                InputLabelProps={{ shrink: true }}
                label={translate('interviews.name')}
              />
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="event_place"
                label={translate('interviews.event_place')}
              />

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

              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="goal"
                label={translate('interviews.goal')}
              />

              <RHFSelect
                fullWidth
                name="type"
                label={translate('interviews.type')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[{ value: 'تربوي', label: translate('interviews.type') }].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {translateValue(option.value)}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                InputLabelProps={{ shrink: true }}
                type="number"
                name="score"
                label={translate('interviews.score')}
              />
            </Box>

            <RHFTextField
              InputLabelProps={{ shrink: true }}
              multiline
              minRows="3"
              name="comment"
              label={translate('interviews.comment')}
              style={{ marginTop: '30px' }}
            />
            <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('sessions.add') : translate('saveChanges')}
              </LoadingButton>
              <Button
                variant="contained"
                onClick={() => {
                  push(PATH_DASHBOARD.sessions.root);
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
