import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import { bgBlur } from '../../utils/cssStyles';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Image from '../../components/image';
import { CustomAvatar } from '../../components/custom-avatar';
import { useLocales } from '../../locales';
import Iconify from '../../components/iconify';
import { imageLink } from 'src/auth/utils';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  zIndex: 99,
  bottom: 0,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('xs')]: {
    right: 'auto',
    display: 'flex',

    alignItems: 'center',
    left: theme.spacing(4),
    bottom: theme.spacing(5),
  },
}));

// ----------------------------------------------------------------------

ProfileCover.propTypes = {
  cover: PropTypes.string,

  image: PropTypes.string,
  username: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
};

export default function ProfileCover({ username, cover, image, first_name, last_name }) {
  const { user } = useAuthContext();
  const { translate } = useLocales();

  const getUsernameTranslation = () => {
    switch (username) {
      case 'org_admin':
        return translate('admins.org_admin_translation'); // Translate to 'مدير المنظمة'
      case 'branch_admin':
        return translate('admins.branch_admin_translation'); // Translate to 'مدير المركز'
      case 'property_admin':
        return translate('admins.property_admin_translation'); // Translate to 'مدير المنطقة'
      case 'student':
        return translate('طالب'); // Translate to 'طالب'
      case 'teacher':
        return translate('أستاذ'); // Translate to 'أستاذ'
      default:
        return username;
    }
  };
  const ICONS = {
    avatarman: 'carbon:user-avatar-filled',
    grade: 'ic:outline-grade',
  };
  return (
    <StyledRoot>
      <StyledInfo>
        {typeof image === 'string' && image ? (
          <CustomAvatar
            src={image.includes('assets') ? image : `${imageLink}/${image}`}
            // color='white'
            alt="image"
            sx={{
              mx: 'auto',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'common.white',
              width: { xs: 80, md: 128 },
              height: { xs: 80, md: 128 },
            }}
          />
        ) : (
          <img
            width={130}
            alt=""
            height={130}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
            src="/assets/logo/profile.png"
          />
        )}

        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">
            <span style={{ marginLeft: 10 }}>
              {first_name} {last_name}
            </span>
          </Typography>

          <Typography sx={{ opacity: 0.72 }}> {getUsernameTranslation(username)}</Typography>
        </Box>
      </StyledInfo>

      <Image
        alt="cover"
        src={cover}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      />
    </StyledRoot>
  );
}
