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
import { Box, Card, Grid, Stack, } from '@mui/material';

import { PATH_DASHBOARD } from '../../routes/paths';
// components

import post, { get } from '../../utils/functions';

import { useLocales } from '../../locales';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
 
  RHFSelect,
  RHFTextField,
 
} from '../../components/hook-form';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

MosqueNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function MosqueNewEditForm({ isEdit, currentProduct }) {
  const [properties, setproperties] = useState([]);
  const [areas, setAreas] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const getproperty = async () => {
    const property = await get('properties-mosques', null, enqueueSnackbar);
    setproperties(property.data);
  };

  useEffect(() => {
    getproperty();
  }, []);

  const getAreas = useCallback(async () => {
    const area = await get('branches', null, enqueueSnackbar);
    setAreas(area.data);
  }, []);
  useEffect(() => {
    getAreas();
  }, [getAreas]);

  const { translate } = useLocales();

  const { push } = useRouter();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(translate('notes.admin_idRequied')),
    capacity: Yup.string().required(translate('notes.student_idRequied')),
    property_type: Yup.string().required(translate('notes.teacher_contentRequied')),
    branch_id: Yup.string().required(translate('notes.teacher_idRequied')),
    description: Yup.string().required(translate('notes.admin_contentRequied')),
    email: Yup.string().required(translate('notes.dateRequied')),
    phone: Yup.string().required(translate('notes.dateRequied')),
    whatsapp: Yup.string().required(translate('notes.dateRequied')),
    facebook: Yup.string().required(translate('notes.dateRequied')),
    location: Yup.string().required(translate('notes.dateRequied')),
    instagram: Yup.string().required(translate('notes.dateRequied')),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      capacity: currentProduct?.capacity || '',
      property_type: currentProduct?.property_type || '',
      teacher_id: currentProduct?.teacher_id || '',
      branch_id: currentProduct?.branch_id || '',
      description: currentProduct?.description || '',
      email: currentProduct?.email || '',
      phone: currentProduct?.phone || '',
      whatsapp: currentProduct?.whatsapp || '',
      facebook: currentProduct?.facebook || '',
      instagram: currentProduct?.instagram || '',
      location: currentProduct?.location || '',
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

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const notes = await post('properties', { ...data });

      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      push(PATH_DASHBOARD.property.root);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
      

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

              <RHFSelect
                native
                name="branch_id"
                label={translate('area.areaName')}
                placeholder={translate('teachers.teachers')}
              >
                <option value="" />
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property?.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                fullWidth
                name="property_type"
                label={translate('properties.property_type')}
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {[
                  {
                    value: translate('properties.property_type_two'),
                    label: translate('properties.property_type_two'),
                  },
                  {
                    value: translate('properties.property_type_one'),
                    label: translate('properties.property_type_one'),
                  },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="capacity" label={translate('properties.capacity')} />
              <RHFTextField name="description" label={translate('properties.description')} />

              <RHFTextField name="email" label={translate('properties.email')} />
              <RHFTextField type="number" name="phone" label={translate('properties.phone')} />

              <RHFTextField
                type="number"
                name="whatsapp"
                label={translate('properties.whatsapp')}
              />

              <RHFTextField name="facebook" label={translate('properties.facebook')} />

              <RHFTextField name="instagram" label={translate('properties.instagram')} />

              <RHFTextField name="location" label={translate('properties.location')} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? translate('properties.add') : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
