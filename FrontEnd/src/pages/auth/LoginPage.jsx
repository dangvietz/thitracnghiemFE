import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { authState, login } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Logo from "../../images/ttn-transparent-logo.png";
import { persistUserState } from "../../features/persistUserSlice";

const loginSchema = yup
    .object({
        email: yup.string().email("Invalid email"),
        password: yup.string().min(8, "Password at least 8 characters"),
    })
    .required();

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [myErrors, setMyErrors] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        loginAction: { successMessage, errorMessage },
    } = useSelector(authState);

    const { user } = useSelector(persistUserState);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginSchema) });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const onSubmit = (data, e) => {
        setMyErrors({
            email: "",
            password: "",
        });

        dispatch(login(data));
    };

    useEffect(() => {
        if (successMessage) {
            // callToast("success", successMessage);
            if (user) {
                navigate("/");
            }
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            setMyErrors({
                ...myErrors,
                password: errorMessage,
            });
        }
    }, [errorMessage]);

    return (
        <div className='w-full min-h-screen' style={{ background: "#fff" }}>
            <div className='flex items-center justify-center w-100'>
                <div className='mt-24' style={{ width: "400px" }}>
                    <div className='w-full flex justify-center mb-5'>
                        <img src={Logo} alt='' width={"100px"} height={"100px"} />
                    </div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleSubmit(onSubmit)(e);
                        }}
                        id='addUserForm'
                    >
                        <div className='mb-5'>
                            <FormControl fullWidth>
                                <TextField
                                    autoComplete='nope'
                                    label={"Mã người dùng"}
                                    {...register("id")}
                                    defaultValue=''
                                    required
                                    error={errors?.id ? true : !!myErrors.id}
                                    helperText={errors?.id ? errors?.id.message : myErrors.id}
                                />
                            </FormControl>
                        </div>
                        <div className='mb-5'>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel htmlFor='outlined-adornment-password'>
                                    Mật khẩu
                                </InputLabel>
                                <OutlinedInput
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='toggle password visibility'
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge='end'
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label='Password'
                                    defaultValue=''
                                    required
                                    error={errors?.password ? true : !!myErrors.password}
                                    autoComplete='new-password'
                                    {...register("password")}
                                />
                                <div className='mt-5 flex justify-center items-center'>
                                    <div>
                                        {myErrors.password && (
                                            <PriorityHighIcon style={{ fill: "red" }} />
                                        )}
                                    </div>
                                    {myErrors.password ||
                                        (errors?.password && (
                                            <span
                                                style={{ color: "red", fontSize: "12px" }}
                                                className=''
                                            >
                                                {errors?.password
                                                    ? errors?.password.message
                                                    : myErrors.password}
                                            </span>
                                        ))}
                                </div>
                                <Button href="/auth/forgotPassword">Quên mật khẩu?</Button>
                            </FormControl>
                        </div>
                        <div className='flex items-center'>
                            <div className='mr-3 w-full'>
                                <FormControl fullWidth>
                                    <Button variant='contained' type='submit'>
                                        Đăng nhập
                                    </Button>
                                </FormControl>
                            </div>
                            <div className='w-full'>
                                <FormControl fullWidth>
                                    <Button
                                        variant='contained'
                                        type='button'
                                        onClick={() => {
                                            window.location.href = "/auth/register";
                                        }}
                                    >
                                        Đăng ký
                                    </Button>
                                </FormControl>
                            </div>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
