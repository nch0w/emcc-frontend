import React from 'react';

import { Box, Typography } from '@material-ui/core';
import { Link } from '@reach/router';

import { SHeading, SContent } from '../styled_components';

const Travel = () => {
    return (
        <Box>
            <SHeading variant='h2'>
                Travel
            </SHeading>
            <SContent>
                <Typography variant='h4' align='center'>Campus Map</Typography>
                <br />
                <Typography variant='body1'>
                    The Phillips Exeter Academy campus address is <Link to='https://www.google.com/maps/place/20+Main+St,+Exeter,+NH+03833/@42.9819091,-70.9518363,18z/data=!4m5!3m4!1s0x89e2eef8d5c19a37:0x39626a2a0e785695!8m2!3d42.9812306!4d-70.95181'>20 Main St, Exeter, NH, 03833</Link>.
                    You can learn more about visiting the campus <Link to='http://www.exeter.edu/about-us/our-campus'>here</Link>.
                </Typography>
                <br />
                <Typography variant='h4' align='center'>Parking</Typography>
                <br />
                <Typography variant='body1'>
                    Visitors to the Academy may park in the semi-circle in front of
                    Jeremiah Smith Hall, in front of and behind Admissions (Bissell
                    House), in any parking lot with assigned visitor parking, and on
                    nearby public streets. The closest parking for EMCC participants
                    is the roadside parking on Front Street, Tan Lane, and other
                    public streets nearby.
                </Typography>
                <br />
                <Typography variant='h4' align='center'>Lodging</Typography>
                <br />
                <Typography variant='body1'>
                    We provide 1 night of hotel stay at the Exeter Fairfield Inn
                    for each <b>U.S.-based team traveling from outside a 350-mile radius from the school</b>.
                    Two hotel rooms are guaranteed, and a third room may be compensated on a first-come first-serve basis
                    (contact <Link to='mailto:exetermathclub@gmail.com'>exetermathclub@gmail.com</Link>).
                    There are transportation services (such as Flightline and Green Rides USA)
                    between airports and Exeter.
                    <br /><br />
                    Please see the <Link to='/payment'>Payment page</Link> for more details.
                </Typography>
            </SContent>
        </Box>
    );
}

export default Travel;