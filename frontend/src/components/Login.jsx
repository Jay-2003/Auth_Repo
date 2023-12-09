import { Avatar, Button, Grid, Paper, TextField, Typography,  } from '@mui/material'
import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import LoginSharpIcon from '@mui/icons-material/LoginSharp';
import { useNavigate , Link} from 'react-router-dom'
import { useAuth } from './AuthContext'

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate()
    const paperStyle = { padding: '30px 25px', width: 300, margin: "20px auto" }
    const headerStyle = { margin: '0px' }
    const avatarStyle = { backgroundColor: 'green' }
    const initialValues = {
        email: '',
        password: ''
    }
    const formValidate = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    });


    const handleSubmit = async (values, props) => {
        // console.log(values)
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log('User Login successfully!');
                login();
                navigate('/content')
            } else {
                console.error('User Login failed.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
        setTimeout(() => {
            props.resetForm()
            props.setSubmitting(false)
        }, 2000)
    }
    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                       <LoginSharpIcon />
                    </Avatar>
                    <h2 style={headerStyle}>
                        Login
                    </h2>
                    <Typography variant='caption'>
                        <h4>Please Fill Credential!!</h4>
                    </Typography>
                </Grid>
                <Formik initialValues={initialValues} validationSchema={formValidate} onSubmit={handleSubmit}>
                    {(props) => (
                        <Form>
                            <Grid item xs={12}><Field as={TextField} name='email' helperText={<ErrorMessage name="email" />} sx={{ marginBottom: 2 }} fullWidth label='Email' placeholder='Enter Your Email' required /></Grid>

                            <Grid item xs={12}><Field as={TextField} name='password' helperText={<ErrorMessage name="password" />} sx={{ marginBottom: 2 }} fullWidth label='Password' type='password' placeholder='Enter Your Password' required /></Grid>


                            <Button type='submit' variant='contained' color='primary' style={{margin:'6px'}} sx={{ marginTop: 2 }}
                                disabled={props.isSubmitting}>{props.isSubmitting ? "Loading" : "Login"}</Button>
                        </Form>
                    )}
                </Formik>
                        <Typography> Do you haven't an account?
                            <Link to="/signup">Sign Up</Link>
                        </Typography>
            </Paper>
        </Grid>
    )
}

export default Login