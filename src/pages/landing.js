// Template from MUI

import * as React from 'react';
import Typography from '@mui/material/Typography';


export default function Landing() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // border: '1px solid red',
        width: '100%',
      }}
    >
      <Typography component='h1' variant='h4'>
        Welcome to Cool Tech!
      </Typography>
    </div>
  );
}
