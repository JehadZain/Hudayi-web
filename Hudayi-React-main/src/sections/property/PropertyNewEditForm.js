import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem';

import { useRouter } from 'next/router';
import { DatePicker } from '@mui/x-date-pickers';

import { useFormContext, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, TextField, Chip, Button } from '@mui/material';
import { fData } from '../../utils/formatNumber';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, { get, postFormData } from '../../utils/functions';
import Label from '../../components/label';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFUploadAvatar,
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from '../../components/hook-form';
import { imageLink } from 'src/auth/utils';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

PropertyNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function PropertyNewEditForm({ isEdit, currentProduct }) {
  const [properties, setproperties] = useState([]);
  const [areas, setAreas] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const getproperty = async () => {
    const property = await get('properties', null, enqueueSnackbar);
    setproperties(property.data);
  };

  useEffect(() => {
    getproperty();
  }, []);

  const getAreas = useCallback(async () => {
    const area = await get('branches', null, enqueueSnackbar);
    setAreas(area.data?.data);
  }, []);
  useEffect(() => {
    getAreas();
  }, [getAreas]);

  const { translate } = useLocales();

  const { push } = useRouter();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(translate('books.required')),
    capacity: Yup.string().required(translate('books.required')),
    property_type: Yup.string().required(translate('books.required')),
    branch_id: Yup.string().required(translate('books.required')),
    // description: Yup.string().required(translate('notes.admin_contentRequied')),
    // email: Yup.string().required(translate('notes.dateRequied')),
    phone: Yup.string().required(translate('books.required')),
    // whatsapp: Yup.string().required(translate('notes.dateRequied')),
    // facebook: Yup.string().required(translate('notes.dateRequied')),
    // location: Yup.string().required(translate('notes.dateRequied')),
    // instagram: Yup.string().required(translate('notes.dateRequied')),
  });
  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      capacity: currentProduct?.capacity || '',
      property_type: currentProduct?.property_type || null,
      teacher_id: currentProduct?.teacher_id || null,
      branch_id: currentProduct?.branch_id || null,
      description: currentProduct?.description || '',
      email: currentProduct?.email || '',
      phone: currentProduct?.phone || '',
      whatsapp: currentProduct?.whatsapp || '',
      facebook: currentProduct?.facebook || '',
      instagram: currentProduct?.instagram || '',
      location: currentProduct?.location || '',
      image:
        currentProduct?.image == null
          ? null
          : `${imageLink}/${currentProduct?.image}`,
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
      const notes = await postFormData(
        isEdit ? `properties/${id}` : 'properties',
        { ...data },
        data.image
      );

      reset();
      enqueueSnackbar(!isEdit ? translate('createSuccess') : translate('updateSuccess'));
      push(PATH_DASHBOARD.property.root);
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
              <RHFTextField name="name" label={translate('properties.name')} />

              <RHFAutocomplete
                name="branch_id"
                onChange={(event, newValue) => setValue('branch_id', newValue.id)}
                options={areas}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) =>
                  option?.name || areas.find((e) => e.id === option)?.name
                }
                renderInput={(params) => (
                  <TextField label={translate('area.areaName')} {...params} />
                )}
              />

              <RHFSelect
                fullWidth
                name="property_type"
                label={translate('properties.property_type')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  {
                    value: 'school',
                    label: translate('properties.property_type_two'),
                  },
                  {
                    value: 'mosque',
                    label: translate('properties.property_type_one'),
                  },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField
                type="number"
                name="capacity"
                label={translate('properties.capacity')}
              />

              <RHFTextField name="email" label={translate('properties.email')} />
              <RHFTextField type="number" name="phone" label={translate('properties.phone')} />

              <RHFTextField
                type="number"
                name="whatsapp"
                label={translate('properties.whatsapp')}
              />

              <RHFTextField name="facebook" label={translate('properties.facebook')} />

              <RHFTextField name="instagram" label={translate('properties.instagram')} />
            </Box>

            <RHFTextField
              style={{ paddingTop: '30px' }}
              multiline
              rows="3"
              name="description"
              label={
                <span style={{ display: 'block', marginTop: '30px' }}>
                  {translate('properties.description')}
                </span>
              }
            />

            <RHFTextField
              style={{ paddingTop: '30px' }}
              multiline
              rows="3"
              name="location"
              label={
                <span style={{ display: 'block', marginTop: '30px' }}>
                  {translate('properties.location')}
                </span>
              }
            />
            {/* <RHFTextField
              fullWidth
              multiline
              minRows="2"
              name="location"
              label={translate('properties.location')}
              style={{ paddingTop: '15px' }}
            /> */}
            <Stack direction="row" sx={{ mt: 3, justifyContent: 'flex-end' }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('properties.add') : translate('saveChanges')}
              </LoadingButton>

              <Button
                variant="contained"
                onClick={() => {
                  push(PATH_DASHBOARD.property.root);
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
