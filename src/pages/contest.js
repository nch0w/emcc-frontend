import React from 'react';

import { Box, Typography } from '@material-ui/core';

import { contestYear, ContestSchedule, RoundFormats } from '../config';
import { SHeading, SContent } from '../styled_components';

const Contest = () => {
    return (
        <Box>
            <SHeading variant='h2'>Contest Information</SHeading>
            <Typography variant='body1'>
                Detailed information is also available in the {contestYear} Coaches' Packet,
                which will be handed out during registration.
            </Typography>
            <br />
            <SContent>
                <ContestSchedule />
                <RoundFormats />
                <br />
                <Typography variant='h3' align='center'>Rules</Typography>
                <br />
                <Typography variant='h4' align='center'>Prohibited Items</Typography>
                <br />
                <Typography variant='body1'>
                    Books, notes, calculators, pocket organizers, slide-rules,
                    abaci, calculator wrist watches, or any other kind of
                    computational aid are prohibited during all parts of the
                    competition. The same goes for graph paper, rulers,
                    protractors, compasses, or any other drawing aid. Similarly,
                    laptops, PDAs, cell phones, or any other electronic
                    communication devices are also not allowed. Any individual
                    or team which breaks these rules will be disqualified.
                </Typography>
                <br />
                <Typography variant='h4' align='center'>Accepted Forms of Answers</Typography>
                <br />
                <ul>
                    <li>Answers need to be simplified and exact unless otherwise
                    specified. (So 3.14 will not work for pi, nor will 4/12
            instead of 1/3.)</li>
                    <li>No partial credit will be given unless specified otherwise.</li>
                    <li>Fractions should be simplified and improper. (For example,
            use 13/4 as opposed to 26/8 or 3 1/4.)</li>
                    <li>Radicals should be simplified so that the radicand does
                    not contain any fractions nor be divisible by the square of
            any integer greater than one. Denominators should be rationalized.</li>
                    <li>Correct mathematical notation should be used.</li>
                </ul>
                <br />
                <Typography variant='body1'>
                    <b>All decisions made by the EMCC judges are final.</b>
                </Typography>
            </SContent>
        </Box>
    );
}

export default Contest;