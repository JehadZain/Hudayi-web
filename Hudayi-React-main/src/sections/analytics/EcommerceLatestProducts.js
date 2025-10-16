// @mui
import PropTypes from 'prop-types';
import { Box, Link, Card, CardHeader, Typography, Stack } from '@mui/material';

import { useLocales } from '../../locales';

import Image from '../../components/image';
import Scrollbar from '../../components/scrollbar';
import { ColorPreview } from '../../components/color-utils';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

EcommerceLatestProducts.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function EcommerceLatestProducts({ title, subheader, list, ...other }) {
  const { translate } = useLocales();

  return (
    <Card style={{ height: '30rem' }} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        {list.length === 0 && (
          <Stack spacing={3} alignContent="center" sx={{ p: 25, pr: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {translate('noRowsLabel')}
            </Typography>
          </Stack>
        )}
        <Stack style={{ height: '31rem' }} spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

ProductItem.propTypes = {
  product: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    name: PropTypes.string,
    pages_count: PropTypes.number,
    student_id: PropTypes.number,
  }),
};

function ProductItem({ product }) {
  const { name, image, pages_count, student_id } = product;

  return (
    <Stack direction="row" spacing={2}>
      <Image
        alt={name}
        src={`${imageLink}/${image}`}
        sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
        <Link
          sx={{ color: 'text.primary', typography: 'subtitle2' }}
        >{`${name} - ${student_id}`}</Link>

        <Stack direction="row">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`عدد الصفحات المقروءة: ${pages_count}`}
          </Typography>
        </Stack>
      </Box>

      {/* <ColorPreview limit={3} colors={product.colors} sx={{ minWidth: 72, pr: 3 }} /> */}
    </Stack>
  );
}
