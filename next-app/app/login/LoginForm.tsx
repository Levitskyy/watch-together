'use client'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Введите имя пользователя'),
      password: Yup.string()
        .required('Введите пароль'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.username, values.password);
        router.push('/');
        router.refresh();
      } catch (err) {
        formik.setFieldError('username', 'Неверный логин или пароль');
        formik.setFieldError('password', 'Неверный логин или пароль');
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={formik.handleSubmit}>
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
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
