import { signin } from '@/api';
import { Spinner1 } from '@/components';
import { useAuth } from '@/context';
import { PATHS, showGenericErrorAsToast, TOAST_OPTIONS } from '@/utils';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';

function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect');

  const [formData, setFormData] = useImmer({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(draft => {
      draft[name] = value;
    });

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('All fields are required!');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address!');
        return;
      }

      const { success, data, fieldErrors, genericErrors } = await signin({ email: formData.email, password: formData.password });

      if (success && data?.user) {
        setUser(data.user);

        setFormData(draft => {
          draft.email = '';
          draft.password = '';
        });
        setError('');


        toast.success("You're in! Let's get started.", TOAST_OPTIONS);
        navigate(redirectTo, { replace: true });
        return;
      }

      if (fieldErrors && fieldErrors.credentials) {
        console.log('done')
        setError(fieldErrors.credentials);
      }
      showGenericErrorAsToast(genericErrors);
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const handleResetSubmit = (e) => {
    e.preventDefault();
    console.log('Reset link sent to:', resetEmail);
    setTimeout(() => {
      setIsModalOpen(false);
      setResetEmail('');
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <main className="flex flex-col flex-grow bg-gradient-to-r from-teal-500 to-blue-600 p-6  dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-grow items-center justify-center w-full">
          <div className="bg-background shadow-2xl rounded-2xl w-full max-w-sm p-8 text-foreground">
            <h2 className="text-3xl font-bold text-center mb-2">Welcome Back!</h2>
            <p className="text-center mb-6">Log in to continue your journey.</p>

            {
              error && (
                <p className="text-red-500 text-center mb-4 border-red-400 bg-red-200 border py-2 rounded-[3px]">
                  {error}
                </p>
              )
            }

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
                {/* Forgot Password */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm mt-2 text-teal-500 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-bold py-3 rounded-lg focus:outline-none shadow-md transition flex justify-center ${isLoading
                  ? 'bg-gradient-to-r from-teal-500 to-blue-600 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:bg-gradient-to-l hover:from-teal-600 hover:to-blue-700 cursor-pointer'
                  }`}
              >
                {isLoading ? <Spinner1 className="w-5 h-5 border-3 border-loading-spinner-color" /> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
              Don't have an account?
              &nbsp;
              <Link to={PATHS.SIGNUP} className="text-teal-500 hover:underline hover:text-teal-600 font-medium dark:text-teal-400 dark:hover:text-teal-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Reset Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xl bg-background/10 flex items-center justify-center z-50 p-4">
          <div className="bg-background shadow-2xl rounded-2xl w-full max-w-sm p-8 relative text-foreground">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-3xl font-bold text-center mb-4">Reset Password</h3>
            <p className="text-center mb-6">
              Enter your registered email address to receive a password reset link.
            </p>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label htmlFor="resetEmail" className="block font-semibold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:bg-gradient-to-l hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;