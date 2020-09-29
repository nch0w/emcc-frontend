import React, { useState } from 'react';

import { Container, Box, Typography } from '@material-ui/core';
import { TextField, Button } from '@material-ui/core';
import { Link } from '@reach/router';
import axios from 'axios';

import { emccServerUrl } from '../config';

const signUpStatus = {
    NotSignedUp: 'not-signed-up',
    InvalidForm: 'invalid-form',
    SignUpSuccess: 'sign-up-success',
    SignUpFailure: 'sign-up-failure'
}

const SignUp = () => {
    const [status, setStatus] = useState(signUpStatus.NotSignedUp);
    const [un, setUn] = useState('');
    const [pw, setPw] = useState('');
    const [cpw, setCpw] = useState('');
    const [email, setEmail] = useState('');
    const [err, setError] = useState('');
    const handleSignup = () => {
        // validate form
        if (un.length === 0 || pw.length === 0 || cpw.length === 0 || email.length === 0) {
            setError('All fields are required.');
            setStatus(signUpStatus.InvalidForm);
            return;
        }
        if (pw !== cpw) {
            setStatus(signUpStatus.InvalidForm);
            setError('Password and Confirm Password do not match.')
            return;
        }
        // submit form
        axios.post(emccServerUrl + '/signup', {
            username: un,
            password: pw,
            email: email
        }, { timeout: 5000 })
            .then(_response => setStatus(signUpStatus.SignUpSuccess))
            .catch(error => {
                console.log(error);
                setStatus(signUpStatus.SignUpFailure);
            });
    }

    const renderMessage = () => {
        switch (status) {
            case signUpStatus.InvalidForm:
                return (
                    <Typography variant='body1' align='left'>
                        Error: invalid sign-up information
                        <br />
                        Reason: {err}
                    </Typography>
                );
            case signUpStatus.SignUpSuccess:
                return (
                    <Typography variant='body1'>
                        Successfully signed up user {un}
                    </Typography>
                );
            case signUpStatus.SignUpFailure:
                return (
                    <Typography variant='body1' align='left'>
                        Something went wrong; we could not update your info currently.
                        Please try again in a few hours, and let us know
                        at <Link to='mailto:exetermathclub@gmail.com'>exetermathclub@gmail.com</Link> if
                        the issue persists.
                    </Typography>
                );
            default:
                return;
        }
    }

    return (
        <Container>
            <Typography variant='h2'>Sign Up</Typography>
            <br />
            <Box align='left'>
                <Typography variant='body1'>
                    Each coach should sign up for exactly one account.
                    Teams, students, and parents do not need to sign up.
                    If you are a student who would like to participate
                    in EMCC, please contact your school's coach.
                    If you would like to participate as an individual
                    and your school is not participating,
                    your parent or guardian can sign up as your coach.
                </Typography>
                <br /><br />
                <TextField required id='signup-un' label='Username' value={un} onChange={event => setUn(event.target.value)} variant='outlined' />
                <br /><br />
                <TextField required id='signup-pw' label='Password' value={pw} onChange={event => setPw(event.target.value)} type='password' variant='outlined' />
                <br /><br />
                <TextField required id='signup-cpw' label='Confirm Password' value={cpw} onChange={event => setCpw(event.target.value)} type='password' variant='outlined' />
                <br /><br />
                <TextField required id='signup-email' label='Email' value={email} onChange={event => setEmail(event.target.value)} variant='outlined' />
                <br /><br />
                <Button variant='outlined' onClick={() => handleSignup()}>Sign Up</Button>
                <br /><br />
                <Typography variant='body1'>
                    You should receive a confirmation email once you have signed up successfully.
                </Typography>
                <br /><br />
                {renderMessage()}
            </Box>
        </Container>
    );
}

export default SignUp;