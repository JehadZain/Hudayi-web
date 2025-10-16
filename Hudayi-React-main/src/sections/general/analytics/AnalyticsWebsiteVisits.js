import PropTypes from 'prop-types';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components

// ----------------------------------------------------------------------

AnalyticsWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AnalyticsWebsiteVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;

 

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      
    </Card>
  );
}
