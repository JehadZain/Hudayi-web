import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import moment from 'moment/moment';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';

import { useFormContext, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import MenuItem from '@mui/material/MenuItem';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Autocomplete,
  Checkbox,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import Label from '../../components/label';
import { PATH_DASHBOARD } from '../../routes/paths';

// components

import post, { filterDate, get, postFormData, putAsObject, sqlTime } from '../../utils/functions';
import { fData } from '../../utils/formatNumber';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from '../../components/hook-form';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ActivityNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function ActivityNewForm({ isEdit, currentUser }) {
  const { push } = useRouter();
  const { translate } = useLocales();
  const [isLoading, setIsLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const [classRooms, setClassRooms] = useState([]);
  const [activities, setActivities] = useState();

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  const getClassRooms = async (word) => {
    const classRoom = await get(`class-room?search=${word}`);
    setClassRooms(classRoom?.data?.data || []);
  };

  const getTeachers = async (word) => {
    const teacher = await get(`teachers?search=${word}`);
    setTeachers(teacher?.data?.data || []);
  };

  const getStudents = async (word) => {
    const student = await get(`students?search=${word}`);
    setStudents(student?.data?.data || []);
  };

  const getActivities = async () => {
    const activity = await get('activities');

    setActivities(activity.data?.data);
  };
  useEffect(() => {
    getActivities();
  }, []);

  const NewUserSchema = Yup.object().shape({
    class_room_id: Yup.string().required(translate('books.required')),
    activity_type_id: Yup.string().required(translate('books.required')),
    teacher_id: Yup.string().required(translate('books.required')),
    name: Yup.string().required(translate('books.required')),
    place: Yup.string().required(translate('books.required')),
    cost: Yup.string().required(translate('books.required')),
    // result: Yup.string().required(translate('books.required')),
    // note: Yup.string().required(translate('books.required')),
    start_datetime: Yup.mixed().nullable().required(translate('books.required')),
    end_datetime: Yup.mixed()
      .required('Due date is required')
      .test(
        'date-min',
        translate('end_date_must_be_later_than_create_date'),
        (value, { parent }) => value.getTime() > parent.start_datetime.getTime()
      ),

    // image: Yup.mixed().required(translate('books.required')),
  });

  const defaultValues = useMemo(
    () => ({
      class_room_id: currentUser?.class_room_id || null,
      activity_type_id: currentUser?.activity_type_id || null,
      teacher_id: currentUser?.teacher_id || null,
      name: currentUser?.name || null,
      student_id: currentUser?.student_id || [],
      place: currentUser?.place || null,
      cost: currentUser?.cost || null,
      result: currentUser?.result || null,
      note: currentUser?.note || null,
      start_datetime: new Date(currentUser?.start_datetime) || '',
      end_datetime: new Date(currentUser?.end_datetime) || '',
      students: currentUser?.participants?.map((e) => e.student) || [],
      image:
        currentUser?.image == null
          ? null
          : `${imageLink}/${currentUser?.image}`,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
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
    if (isEdit && currentUser) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);
  const {
    query: { id },
  } = useRouter();
  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);
      const activitie = await postFormData(
        isEdit ? `activities/${id}` : 'activities',
        {
          ...data,
          start_datetime: new Date(data.start_datetime).toISOString().slice(0, 10),
          end_datetime: new Date(data.end_datetime).toISOString().slice(0, 10),
        },
        data.image
      );

      const isSuccess = activitie.api === 'SUCCESS';
      const isDuplicate = activitie.hints['0']?.includes('Duplicate');

      if (isSuccess) {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.activities.root);
      } else if (isDuplicate) {
        enqueueSnackbar('تأكد من أن جميع البيانات نادرة', { variant: 'error' });
      } else {
        const error = activitie.hints['0'];
        enqueueSnackbar(error, { variant: 'error' });
      }

      setIsLoading(false);

      if (isSuccess) {
        const activityParticipantsPromises = isEdit
          ? await putAsObject(
              `activity-participants/${activitie.data.id}?activity_id=${activitie.data.id}`,
              {
                activity_id: parseInt(activitie.data.id, 10),
                student_id: data.students.map((student) => parseInt(student?.id, 10)),
              }
            )
          : await post('activity-participants', {
              id: null,
              activity_id: parseInt(activitie.data.id, 10),
              student_id: data.students.map((student) => parseInt(student?.id, 10)),
            });
      }

      reset();
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
  const uniqueActivities = activities
    ? activities.filter(
        (activity, index, self) =>
          index === self.findIndex((a) => a.activity_type_id === activity.activity_type_id)
      )
    : [];

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
                name="class_room_id"
                label={translate('classRooms.classRooms')}
                onChange={(event, newValue) => setValue('class_room_id', newValue?.id)}
                options={classRooms}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.name) {
                    return `${option.name} `;
                  }
                  if (isEdit && classRooms.length === 0) {
                    return `${currentUser?.name}`;
                  }
                  const foundClassRooms = classRooms.find((e) => e.id === option);
                  if (foundClassRooms && foundClassRooms?.name) {
                    return `${foundClassRooms?.name}`;
                  }

                  return '';
                }}
                textFieldOnChange={(event) => {
                  getClassRooms(event.target.value);
                }}
              />
              <RHFAutocomplete
                name="activity_type_id"
                onChange={(event, newValue) => setValue('activity_type_id', newValue.id)}
                options={uniqueActivities}
                label={translate('activities.activity_type')}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.name) {
                    return `${option?.name} `;
                  }

                  const foundActivities = uniqueActivities.find((e) => e.id === option);
                  if (foundActivities) {
                    return `${foundActivities?.name} `;
                  }

                  return '';
                }}
                textFieldOnChange={(event) => {}}
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
                    return `${currentUser?.teacher?.user?.first_name} ${currentUser?.teacher?.user?.last_name}`;
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

              <RHFAutocomplete
                name="students"
                multiple
                label={translate('students.students')}
                onChange={(event, newValue) => setValue('students', newValue)}
                options={students}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option?.user?.first_name) {
                    return `${option?.user?.first_name} ${option?.user?.last_name} `;
                  }
                  if (isEdit && students.length === 0) {
                    return `${currentUser?.user?.first_name} ${currentUser?.user?.last_name}`;
                  }
                  const foundStudents = students.find((e) => e.id === option);
                  if (foundStudents && foundStudents?.user?.first_name) {
                    return `${foundStudents?.user.first_name} ${foundStudents?.user.last_name}`;
                  }

                  return '';
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option?.id} // Use a unique key for each chip, such as the "id" of the student.
                      size="small"
                      label={`${option?.user?.first_name} ${option?.user?.last_name}`}
                    />
                  ))
                }
                textFieldOnChange={(event) => {
                  getStudents(event.target.value);
                }}
              />
              <RHFTextField
                name="name"
                label={translate('activities.name')}
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="place"
                label={translate('activities.place')}
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                type="number"
                name="cost"
                label={translate('activities.cost')}
              />

              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="result"
                label={translate('activities.result')}
              />

              <Controller
                name="start_datetime"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={translate('activities.start_datetime')}
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

              <Controller
                name="end_datetime"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label={translate('activities.end_datetime')}
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
            &nbsp;
            <RHFTextField
              key={`note_r_${getValues('note')}`}
              multiline
              minRows="5"
              name="note"
              label={translate('activities.note')}
            />
            <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('activities.add') : translate('saveChanges')}
              </LoadingButton>

              <Button
                variant="contained"
                onClick={() => {
                  push(PATH_DASHBOARD.activities.root);
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
