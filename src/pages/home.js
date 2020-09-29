import React from 'react';

import { Container, Box, Typography } from '@material-ui/core';

import { contestDate, contestStatus } from '../config';


const Home = () => {
    return (
        <Container>
            <Typography variant='h1'>EMCC</Typography>
            <Typography variant='h3'>The Exeter Math Club Competition</Typography>
            <br />
            <Typography variant='h5'>{contestDate}, Phillips Exeter Academy</Typography>
            <br /><br />
            <Typography variant='h6'>{contestStatus}</Typography>
            <br /><br /><br />
            <Box align='left'>
                <Typography variant='h3' align='center'>What is EMCC?</Typography>
                <br />
                <Typography variant='body1'>
                    The Exeter Math Club Competition is a middle-school mathematics competition
                    held annually at Phillips Exeter Academy in Exeter, New Hampshire.
                    EMCC provides middle schoolers a event where they can join like-minded peers
                    from a mathematical community spanning the globe.
                </Typography>
                <br />
                <Typography variant='body1'>
                    While designing EMCC, we've taken inspiration from the contests
                    that we ourselves attend and formatted our contest similarly.
                    This means that attending EMCC will not only be an enjoyable
                    experience but will also prepare you for future contests.
                </Typography>
                <br />
                <Typography variant='h3' align='center'>Who can attend?</Typography>
                <br />
                <Typography variant='body1'>
                    Anyone in 8th grade or below. We accept registration
                    as teams of students from the same school or individuals.
                    Teams consist of up to four people, so we will combine individuals
                    into teams of four. Competitors aren't limited to just the United States &mdash;
                    in the past, we've hosted students from far away places like China and Illinois.
                </Typography>
            </Box>
        </Container>
    );
}

export default Home;