import React, { useState } from 'react';

import './Header.css';
import Button from '@material-ui/core/Button';
import logo from '../../assets/logo.svg';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const Header = (props) => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [username, setUsername] = useState("");
    const [usernameRequired, setUsernameRequired] = useState("dispNone");
    const [loginPasswordRequired, setLoginPasswordRequired] = useState("dispNone");
    const [loginPassword, setloginPassword] = useState("");
    const [firstnameRequired, setFirstnameRequired] = useState("dispNone");
    const [firstname, setFirstname] = useState("");
    const [lastnameRequired, setLastnameRequired] = useState("dispNone");
    const [lastname, setLastname] = useState("");
    const [emailRequired, setEmailRequired] = useState("dispNone");
    const [email, setEmail] = useState("");
    const [registerPasswordRequired, setRegisterPasswordRequired] = useState("dispNone");
    const [registerPassword, setRegisterPassword] = useState("");
    const [contactRequired, setContactRequired] = useState("dispNone");
    const [contact, setContact] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("access-token") == null ? false : true);
    const [bookShowRequested, setBookShowRequested] = useState(false);


    const history = useHistory();

    /** Handler  to set the state of any modal open to track the status */
    const openModalHandler = () => {
        setModalIsOpen(true);
    }

    /** Handler  to set the state of any modal closed to track the status */
    const closeModalHandler = () => {
        setUsername('');
        setloginPassword('');
        setModalIsOpen(false);
    }

    /** Handler  to set the current tab */
    const tabChangeHandler = (event, value) => {
        setValue(value);
    }

    /** Handler  to process the login action */
    const loginClickHandler = () => {
        username === "" ? setUsernameRequired("dispBlock") : setUsernameRequired("dispNone");
        loginPassword === "" ? setLoginPasswordRequired("dispBlock") : setLoginPasswordRequired("dispNone");

        if (username && loginPassword) {

            /** Build the header with the basic authentication token */
            const headers = {
                "Authorization": `Basic ${window.btoa(username + ":" + loginPassword)}`,
                'Content-Type': 'application/json',
                'Cache-Control': "no-cache"
            }

            /** use Axios post the sendthe header to the login API */
            axios.post(props.baseUrl + "auth/login", {}, {
                headers
            }).then(res => {
                sessionStorage.setItem("uuid", res.data.id);
                sessionStorage.setItem("access-token", res.headers['access-token']);

                setLoggedIn(true)

                // Automatically close the login modal after 2 seconds
                setTimeout(() => {
                    closeModalHandler();
                }, 2000);

                /** If the user is shown the login modal because he clicked the book show 
                 * button without logging in, then take the user to the book show page
                 */
                if (bookShowRequested) {
                    history.push('/bookshow/' + props.id);
                    setBookShowRequested(false);
                }
            }).catch(
                function (error) {
                    if (error.response) {
                        // Request made and server responded
                        let message = error.response.data.message;
                        if (message === 'Password match failed' ||
                            message === 'Username does not exist' ||
                            message === 'User account is LOCKED') {
                            alert(error.response.data.message);
                        } else {
                            console.log(error.message);
                        }

                    } else if (error.request) {
                        // The request was made but no response was received
                        alert(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        alert('Error', error.message);
                    }
                }
            );
        } else {
            alert('Please enter valid credentials');
        }

    }

    /** The following two handlers are for storing the inputs of username and password by the user */
    const inputUsernameChangeHandler = (e) => {
        setUsername(e.target.value);
    }

    const inputLoginPasswordChangeHandler = (e) => {
        setloginPassword(e.target.value)
    }

    /** Registration processing handler */
    const registerClickHandler = () => {
        firstname === "" ? setFirstnameRequired("dispBlock") : setFirstnameRequired("dispNone");
        lastname === "" ? setLastnameRequired("dispBlock") : setLastnameRequired("dispNone");
        email === "" ? setEmailRequired("dispBlock") : setEmailRequired("dispNone");
        registerPassword === "" ? setRegisterPasswordRequired("dispBlock") : setRegisterPasswordRequired("dispNone");
        contact === "" ? setContactRequired("dispBlock") : setContactRequired("dispNone");

        /** Check for all data */
        if (firstname && lastname && email && registerPassword && contact) {
            let dataSignup = {
                "email_address": email,
                "first_name": firstname,
                "last_name": lastname,
                "mobile_number": contact,
                "password": registerPassword
            };

            axios.post(props.baseUrl + "signup", dataSignup).then(res => {
                setRegistrationSuccess(true);

                // Automatically switch to the login tab after 2 seconds and reset all the values
                setTimeout(() => {
                    setValue(0);
                    setFirstname('');
                    setLastname('');
                    setEmail('');
                    setContact('');
                    setRegisterPassword('');
                    setRegistrationSuccess(false);
                }, 2000);
            });
        } else {
            alert('Please fill all mandatory fields');
            setRegistrationSuccess(false);
        }
    }

    /** The following five handlers are for storing the inputs by the user for registration details */
    const inputFirstNameChangeHandler = (e) => {
        setFirstname(e.target.value);
    }

    const inputLastNameChangeHandler = (e) => {
        setLastname(e.target.value);
    }

    const inputEmailChangeHandler = (e) => {
        setEmail(e.target.value)
    }

    const inputRegisterPasswordChangeHandler = (e) => {
        setRegisterPassword(e.target.value);
    }

    const inputContactChangeHandler = (e) => {
        setContact(e.target.value)
    }

    /** Handles the logout button click event */
    const logoutHandler = (e) => {
        const headers = {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Authorization: "Bearer " + sessionStorage.getItem("access-token"),
        }
        axios.post(props.baseUrl + "auth/logout", {}, {
            headers
        }).then(res => {

            sessionStorage.removeItem("uuid");
            sessionStorage.removeItem("access-token");
            setLoggedIn(false);
        });
    }

    const guestBookShowHandler = (e) => {
        openModalHandler();
        setBookShowRequested(true);
    }

    /** return the div with the header, login/logout button, BookShow button and the Login/Register Modal */
    return (
        <div>
            {/** The App header with login/logout and book show buttons*/}
            <header className="app-header">
                <img src={logo} className="app-logo" alt="Movies App Logo" />
                {!loggedIn ?
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={openModalHandler}>
                            Login
                        </Button>
                    </div>
                    :
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={logoutHandler}>
                            Logout
                        </Button>
                    </div>
                }

                {props.showBookShowButton === "true" && !loggedIn
                    ? <div className="bookshow-button">
                        <Button variant="contained" color="primary" onClick={guestBookShowHandler}>
                            Book Show
                        </Button>
                    </div>
                    : ""
                }

                {props.showBookShowButton === "true" && loggedIn
                    ? <div className="bookshow-button">
                        <Link to={"/bookshow/" + props.id}>
                            <Button variant="contained" color="primary">
                                Book Show
                            </Button>
                        </Link>
                    </div>
                    : ""
                }

            </header>

            {/** The Login/Register Modal*/}
            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                contentLabel="Login"
                onRequestClose={closeModalHandler}
                style={customStyles}
            >
                <Tabs className="tabs" value={value} onChange={tabChangeHandler}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {value === 0 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" username={username} onChange={inputUsernameChangeHandler} />
                            <FormHelperText className={usernameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="loginPassword">Password</InputLabel>
                            <Input id="loginPassword" type="password" loginpassword={loginPassword} onChange={inputLoginPasswordChangeHandler} />
                            <FormHelperText className={loginPasswordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        {loggedIn === true &&
                            <FormControl>
                                <span className="successText">
                                    Login Successful!
                                </span>
                            </FormControl>
                        }
                        <br />
                        <Button variant="contained" color="primary" onClick={loginClickHandler}>LOGIN</Button>
                    </TabContainer>
                }

                {value === 1 &&
                    <TabContainer>
                        <FormControl required>
                            <InputLabel htmlFor="firstname">First Name</InputLabel>
                            <Input id="firstname" type="text" firstname={firstname} onChange={inputFirstNameChangeHandler} />
                            <FormHelperText className={firstnameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="lastname">Last Name</InputLabel>
                            <Input id="lastname" type="text" lastname={lastname} onChange={inputLastNameChangeHandler} />
                            <FormHelperText className={lastnameRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" email={email} onChange={inputEmailChangeHandler} />
                            <FormHelperText className={emailRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="registerPassword">Password</InputLabel>
                            <Input id="registerPassword" type="password" registerpassword={registerPassword} onChange={inputRegisterPasswordChangeHandler} />
                            <FormHelperText className={registerPasswordRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        <FormControl required>
                            <InputLabel htmlFor="contact">Contact No.</InputLabel>
                            <Input id="contact" type="tel" contact={contact} onChange={inputContactChangeHandler} />
                            <FormHelperText className={contactRequired}>
                                <span className="red">required</span>
                            </FormHelperText>
                        </FormControl>
                        <br /><br />
                        {registrationSuccess === true &&
                            <FormControl>
                                <span className="successText">
                                    Registration Successful. Please Login!
                                </span>
                            </FormControl>
                        }
                        <br />
                        <Button variant="contained" color="primary" onClick={registerClickHandler}>REGISTER</Button>
                    </TabContainer>
                }
            </Modal>
        </div>
    )
}



export default Header;