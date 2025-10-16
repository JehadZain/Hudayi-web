import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';

import {  useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
 
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, {
  convertTimeToDateTime,
  get,
  postFormData,
  put,
  putAsObject,
} from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,

  RHFAutocomplete,
} from '../../components/hook-form';
import LoadingScreen from '../../components/loading-screen/LoadingScreen';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

SessionNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function SessionNewEditForm({ isEdit, currentProduct }) {
  const [teachers, setTeachers] = useState([]);
  const [classRooms, setClassRooms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const getSessions = async (word) => {
    const session = await get(`sessions?search=${word}`, null, enqueueSnackbar);
    setSessions(session?.data?.data || []);
  };

  const getClassRooms = async (word) => {
    const classRoom = await get(`class-room?search=${word}`, null, enqueueSnackbar);
    setClassRooms(classRoom?.data?.data || []);
  };
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
    name: Yup.string().required(translate('students.required')),
    description: Yup.string().required(translate('students.required')),
    date: Yup.mixed().required(translate('students.required')),
    start_at: Yup.string().required(translate('students.required')),
    duration: Yup.string().required(translate('students.required')),
    teacher_id: Yup.string().required(translate('students.required')),
    place: Yup.string().required(translate('students.required')),
    subject_name: Yup.string().required(translate('students.required')),
    class_room_id: Yup.string().required(translate('students.required')),
    type: Yup.string().required(translate('students.required')),
  });
  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      date: new Date(currentProduct?.date) || '',
      start_at: currentProduct?.start_at?.split(' ')[1] || '00',
      duration: currentProduct?.duration || '',
      teacher_id: currentProduct?.teacher_id || null,
      student_id: currentProduct?.student || null,
      place: currentProduct?.place || '',
      subject_name: currentProduct?.subject_name || null,
      class_room_id: currentProduct?.class_room_id || null,
      type: currentProduct?.type || null,
      students: currentProduct?.session_attendances?.map((e) => e.student) || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
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
      const start_at = await convertTimeToDateTime(data.start_at);
      const sesion = isEdit
        ? await put(
            `sessions/${id}?name=${data.name}&description=${data.description}&date=${
              data.date
            }&start_at=${`2023:02:01 ${data.start_at}`}&duration=${data.duration}&teacher_id=${
              data.teacher_id
            }&class_room_id=${data.class_room_id}&subject_name=${data.subject_name}&place=${
              data.place
            }&type=${data.type}`
          )
        : await postFormData('sessions', {
            id: null,
            ...data,
            start_at: `2023:02:01 ${data.start_at}:00`,
          });

      if (sesion.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.sessions.root);
      } else if (sesion.hints['0']?.includes('Duplicate')) {
        enqueueSnackbar(translate("data_unique"), { variant: 'error' });
      } else {
        const error = sesion.hints['0'];
        enqueueSnackbar(error, { variant: 'error' });
      }
      setIsLoading(false);
     
      if (sesion.api === 'SUCCESS') {
        try {
          const session_attendances = isEdit
            ? await putAsObject(
                `session-attendances/${sesion.data.id}?session_id=${sesion.data.id}`,
                {
                  session_id: parseInt(sesion.data.id, 10),
                  student_id: data.students.map((student) => parseInt(student?.id, 10)),
                }
              )
            : await post('session-attendances', {
                id: null,
                session_id: parseInt(sesion.data.id, 10),
                student_id: data.students.map((student) => parseInt(student?.id, 10)),
              });
        } catch (error) {
          console.error(error);
        }
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };
  const uniqueSubject = sessions
    ? sessions?.filter(
        (quiz, index, self) => index === self.findIndex((q) => q.subject_name === quiz.subject_name)
      )
    : [];

  const styles = `
    input[type="time"]::-webkit-calendar-picker-indicator {
      position: absolute;
      left: 75px;
    }
  `;
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
    if (foundTeacher && foundTeacher?.user?.first_name) {
      return `${foundTeacher?.user.first_name} ${foundTeacher?.user.last_name}`;
    }

    return '';  // This 'return' statement is sufficient for the default case.
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
                    return `${currentProduct?.user?.first_name} ${currentProduct?.user?.last_name}`;
                  }
                
                  const foundStudents = students.find((e) => e.id === option);
                  if (foundStudents && foundStudents?.user?.first_name) {
                    return `${foundStudents?.user.first_name} ${foundStudents?.user.last_name}`;
                  }
                
                  return '';  // This 'return' statement is sufficient for the default case.
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
                    return `${currentProduct.class_room?.name}`;
                  }
                
                  const foundClassRooms = classRooms.find((e) => e.id === option);
                  if (foundClassRooms && foundClassRooms?.name) {
                    return `${foundClassRooms?.name}`;
                  }
                
                  return '';  // This 'return' statement is sufficient for the default case.
                }}
                textFieldOnChange={(event) => {
                  getClassRooms(event.target.value);
                }}
              />
              <RHFTextField name="name" label={translate('sessions.name')} />
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
                <RHFTextField type="time" name="start_at" label={translate('sessions.start_at')} />
              </div>
              <RHFTextField type="number" name="duration" label={translate('sessions.duration')} />
              <RHFTextField name="place" label={translate('sessions.place')} />
              <RHFTextField
               InputLabelProps={{ shrink: true }}
                name="type"
                label={translate('sessions.type')}
              />

<RHFAutocomplete
  name="subject_name"
  
  label={translate('classRooms.subject_name')}
  onChange={(event, newValue) => setValue('subject_name', newValue?.subject_name)}
  options={uniqueSubject}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  getOptionLabel={(option) => {
    if (option?.subject_name) {
      return `${option.subject_name} `;
    }

    if (isEdit && sessions.length === 0) {
      return `${currentProduct?.subject_name}`;
    }

    const foundSubject = sessions.find((e) => e.subject_name === option);
    if (foundSubject) {
      return `${foundSubject?.subject_name}`;
    }

    return '';
  }}
  textFieldOnChange={(event) => {
    getSessions(event.target.value);
  }}
/>

            </Box>
            <RHFTextField
              style={{ paddingTop: '30px' }}
              multiline
              rows="3"
              name="description"
              label={
                <span style={{ display: 'block', marginTop: '30px' }}>
                  {translate('sessions.description')}
                </span>
              }
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
