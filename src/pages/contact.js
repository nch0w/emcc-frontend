import React from 'react';

import { Container, Typography } from '@material-ui/core';

import { ContactInfo } from '../config';

const Contact = () => {
    return (
        <Container>
            <Typography variant='h2'>
                Contact
            </Typography>
            <ContactInfo />
        </Container>
    );
}

export default Contact;