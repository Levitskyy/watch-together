import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../components/AuthProvider';
import axiosInstance from '../components/axiosInstance';
import { serverURL } from '../App';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Обязательное поле'),
    password: Yup.string().required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const params = new URLSearchParams();
      params.append('username', values.name);
      params.append('password', values.password);

      const response = await axiosInstance.post(`http://${serverURL}/api/auth/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true
      });
  
      const { data } = response;
      
      console.log(data.access_token);
      setToken(data.access_token);
      setSubmitting(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Error during authentication:', error);
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Добавьте логику для обработки забытого пароля
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900">
      <div className="bg-neutral-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-200">Вход</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-slate-200">Логин</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">Пароль</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="mb-4 text-left">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Забыли пароль?
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-white bg-neutral-700 rounded-md hover:bg-neutral-600 focus:outline-none focus:bg-indigo-700"
                >
                  Войти
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
