import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';

import { useFormContext, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import MenuItem from '@mui/material/MenuItem';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
import Label from '../../components/label';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { fData } from '../../utils/formatNumber';

import { get, postFormData } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from '../../components/hook-form';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

BookNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function BookNewEditForm({ isEdit, currentUser }) {
  const { push } = useRouter();
  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();
  const [properties, setProperties] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getProperties = async () => {
    const property = await get('properties');
    setProperties(property.data);
  };
  useEffect(() => {
    getProperties();
  }, []);
  const {
    query: { id },
  } = useRouter();
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required(translate('books.required')),
    size: Yup.string().required(translate('books.required')),
    paper_count: Yup.string().required(translate('books.required')),
    author_name: Yup.string().required(translate('books.required')),
    property_type: Yup.string().required(translate('books.required')),
    book_type: Yup.string().required(translate('books.required')),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || null,
      size: currentUser?.size || null,
      paper_count: currentUser?.paper_count || null,
      author_name: currentUser?.author_name || null,
      property_type: currentUser?.property_type || null,
      book_type: currentUser?.book_type || null,
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
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(true);

      const books = await postFormData(isEdit ? `books/${id}` : 'books', { ...data }, data.image);
      if (books.api === 'SUCCESS') {
        reset();
        enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
        push(PATH_DASHBOARD.books.root);
      } else if (books.hints['0']?.includes('Duplicate')) {
        enqueueSnackbar(translate('data_unique'), { variant: 'error' });
      } else {
        const error = books.hints['0'];
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
              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="name"
                label={translate('books.name')}
              />

              <RHFSelect
                fullWidth
                name="size"
                label={translate('books.size')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: 'A1', label: 'A1' },
                  { value: 'A2', label: 'A2' },
                  { value: 'A3', label: 'A3' },
                  { value: 'A4', label: 'A4' },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                type="number"
                name="paper_count"
                InputLabelProps={{ shrink: true }}
                label={translate('books.paper_count')}
              />

              <RHFTextField
                InputLabelProps={{ shrink: true }}
                name="author_name"
                label={translate('books.author_name')}
              />

              <RHFSelect
                fullWidth
                name="property_type"
                label={translate('properties.property_type')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  { value: 'mosque', label: translate('properties.mosque_translation') },
                  { value: 'school', label: translate('properties.school_translation') },
                ].map((option) => (
                  <MenuItem key={option} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                fullWidth
                name="book_type"
                label={translate('books.book_type')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  {
                    value: translate('books.book_type_two'),
                    label: translate('books.book_type_two'),
                  },
                  {
                    value: translate('books.book_type_one'),
                    label: translate('books.book_type_one'),
                  },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('books.add') : translate('saveChanges')}
              </LoadingButton>
              <Button
                variant="contained"
                onClick={() => {
                  push(PATH_DASHBOARD.books.root);
                }}
                sx={{
                  marginLeft: 2,

                  backgroundColor: 'error.dark',
                  '&:hover': {
                    backgroundColor: '#8e0502',
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
