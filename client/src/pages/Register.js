import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';
import gql from 'graphql-tag';

function Register(props) {

    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmedPassword: ''
    })

    // spread existing values or it will override it

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData }}){
            console.log(userData)
            context.login(userData)
            props.history.push('/')
        },
        onError(err){
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.exception.errors)

        },
        variables: values
    })

    function registerUser(){
         addUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Register</h1>
                <Form.Input 
                    label="Username" 
                    placeholder="Username"
                    name="username"
                    value={values.username}
                    error={errors.username ? true : false}
                    type="text"
                    onChange={onChange}
                />
                <Form.Input 
                    label="Email" 
                    placeholder="Email"
                    name="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    type="email"
                    onChange={onChange}
                />
                <Form.Input 
                    label="Password" 
                    placeholder="Password"
                    name="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    type="password"
                    onChange={onChange}
                />
                <Form.Input 
                    label="Confirm Password" 
                    placeholder="Confirm Password"
                    name="confirmedPassword"
                    value={values.confirmedPassword}
                    error={errors.confirmedPassword ? true : false}
                    type="password"
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                  <div className="ui error message">
                  <ul className="list">
                      {Object.values(errors).map(value => (
                          <li key={value}>{value}</li>
                      ))}
                  </ul>
              </div>
            )}
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmedPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmedPassword: $confirmedPassword
            }
        ){
            id email username createdAt token
        }
    }
`

export default Register;