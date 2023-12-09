import { Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material'
import React from 'react'
import LoupeSharpIcon from '@mui/icons-material/LoupeSharp';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate } from 'react-router';


const Signup = () => {
    const navigate = useNavigate();
    const paperStyle = { padding: '30px 25px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: '0px' }
    const avatarStyle = { backgroundColor: 'green' }
    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    }
    const formValidate = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });


    const handleSubmit = async (values, props) => {
        console.log(values)

        // e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log('User registered successfully!');
                // You can redirect or perform other actions on success
                navigate('/login')
            } else {
                console.error('User registration failed.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
        setTimeout(()=>{
            props.resetForm()
            props.setSubmitting(false)
        },2000)
    }
    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <LoupeSharpIcon />
                    </Avatar>
                    <h2 style={headerStyle}>
                        Sign Up
                    </h2>
                    <Typography variant='caption'>
                        <h4>Please Fill Details for Create New Account!!</h4>
                    </Typography>
                </Grid>
                <Formik initialValues={initialValues} validationSchema={formValidate} onSubmit={handleSubmit}>
                    {(props) => (
                        <Form>
                            <Grid item xs={12}><Field as={TextField} name='username' helperText={<ErrorMessage name="username" />} sx={{ marginBottom: 2, marginTop: 2 }} fullWidth label='Username' placeholder='Enter Your Name' required /></Grid>

                            <Grid item xs={12}><Field as={TextField} name='email' helperText={<ErrorMessage name="email" />} sx={{ marginBottom: 2 }} fullWidth label='Email' placeholder='Enter Your Email' required /></Grid>

                            <Grid item xs={12}><Field as={TextField} name='password' helperText={<ErrorMessage name="password" />} sx={{ marginBottom: 2 }} fullWidth label='Password' type='password' placeholder='Enter Your Password' required /></Grid>

                            <Grid item xs={12}><Field as={TextField} name='confirmPassword' helperText={<ErrorMessage name="confirmPassword" />} sx={{ marginBottom: 2 }} fullWidth label='Confirm Password' type='password' placeholder='Enter Your Password Again' required /></Grid>

                            <Button type='submit' variant='contained' color='primary' sx={{ marginTop: 2 }}
                                disabled={props.isSubmitting}>{props.isSubmitting ? "Loading" : "Sign Up"}</Button>
                        </Form>
                    )}
                </Formik>

            </Paper>
        </Grid>
    )
}

export default Signup