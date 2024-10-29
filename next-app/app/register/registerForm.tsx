'use client'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Неверный адрес эл. почты')
        .required('Обязательное поле'),
      username: Yup.string()
        .min(3, 'Имя пользователя должно содержать минимум 3 символа')
        .required('Обязательное поле'),
      password: Yup.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .required('Обязательное поле'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Пароли должны совпадать')
        .required('Обязательное поле'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HTTP_BACK}/auth/register`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': values.username,
                'email': values.email,
                'password': values.password,
            }),
        });
        if (response.status === 200) {
            await login(values.username, values.password);
            router.push('/');
        } else {
            formik.setFieldError('email', 'Registration failed');
        }
      } catch (err) {
        formik.setFieldError('email', 'Registration failed');
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Эл. почта</label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps('email')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Имя пользователя</label>
            <input
              type="text"
              id="username"
              {...formik.getFieldProps('username')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="text-red-500">{formik.errors.username}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Пароль</label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps('password')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500">{formik.errors.password}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              {...formik.getFieldProps('confirmPassword')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Зарегистрироваться 
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
