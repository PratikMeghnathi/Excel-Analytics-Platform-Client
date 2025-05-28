import { signup } from '@/api';
import { Spinner1 } from '@/components';
import { Eye, EyeSlash, PATHS, showGenericErrorAsToast, TOAST_OPTIONS } from '@/utils';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useImmer } from 'use-immer';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useImmer({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useImmer({
    passwordMismatch: '',
    emailExists: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(draft => {
      draft[name] = type === 'checkbox' ? checked : value;
    });
    setErrors(draft => {
      if (name === 'password' || name === 'confirmPassword') {
        draft.passwordMismatch = '';
      }
      if (name === 'email') {
        draft.emailExists = '';
      }
    });
  };
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(draft => {
      draft[name] = checked;
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(prev => !prev);
  };

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Moderate';
    return 'Strong';
  };
  const getPasswordStrengthColor = (password) => {
    if (password.length < 6) return 'text-red-500';
    if (password.length < 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ passwordMismatch: '', emailExists: '' })

    setIsLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) {
        return setErrors(draft => {
          draft.passwordMismatch = 'Passwords do not match';
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return setErrors(draft => {
          draft.emailExists = 'Please enter a valid email address!';
        });
      }

      const { success, fieldErrors, genericErrors } = await signup({ email: formData.email, password: formData.password, username: formData.username });
      if (success) {
        navigate(PATHS.SIGNIN);
        toast.success('Signup successful! You can now sign in.', TOAST_OPTIONS);

        setFormData(draft => {
          draft.username = '';
          draft.email = '';
          draft.password = '';
          draft.confirmPassword = '';
          draft.termsAccepted = false;
        });

        setErrors(draft => {
          draft.passwordMismatch = '';
          draft.emailExists = '';
        });
        return;
      }

      if (fieldErrors && fieldErrors.email) {
        setErrors(draft => {
          draft.emailExists = fieldErrors.email;
        });
      }

      showGenericErrorAsToast(genericErrors);

    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-600 dark:from-gray-800 dark:to-gray-900 flex flex-col justify-center">

      {/* Signup Card */}
      <div className="relative bg-background shadow-lg rounded-2xl w-full max-w-md p-8 mx-auto text-foreground">
        <h2 className="text-3xl font-semibold text-center mb-4">Create Your Account</h2>
        <p className="text-center mb-6">Join us and unlock the possibilities!</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {
              errors.emailExists &&
              <p className="text-red-500 dark:text-red-400 text-sm pl-1 pt-1">{errors.emailExists}</p>
            }
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {
              formData.password && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-4 text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                >
                  {passwordVisible ? <Eye /> : <EyeSlash />}
                </button>
              )
            }

            {/* Password Strength Indicator */}
            {
              formData.password && (
                <div className="text-sm pl-2 pt-1">
                  <span className={`${getPasswordStrengthColor(formData.password)} dark:text-gray-400`}>
                    {getPasswordStrength(formData.password)}
                  </span>
                </div>
              )
            }
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {
              formData.confirmPassword && (
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-4 text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                >
                  {confirmPasswordVisible ? <Eye /> : <EyeSlash />}
                </button>
              )
            }
            {
              errors.passwordMismatch &&
              <p className="text-red-500 dark:text-red-400 text-sm pl-1 pt-1">{errors.passwordMismatch}</p>
            }
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleCheckboxChange}
              required
              className="h-4 w-4 text-teal-500 focus:ring-teal-500 mt-1 cursor-pointer"
            />
            <label>
              I agree to the{' '}
              <Link to={PATHS.TERMS_OF_SERVICES} className="text-teal-500 hover:text-teal-600 hover:underline dark:text-teal-400 dark:hover:text-teal-500">
                Terms and Conditions.
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full font-semibold py-3 rounded-lg focus:outline-none shadow-md transition-all duration-200 bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:bg-gradient-to-l hover:from-teal-600 hover:to-blue-700 hover:shadow-lg flex justify-center
              ${isLoading ? 'opacity-50 cursor-not-allowed hover:from-teal-500 hover:to-blue-600 hover:shadow-md' : 'cursor-pointer'}`}
            disabled={isLoading}
          >
            {
              isLoading ? <Spinner1 className='w-5 h-5 border-3 border-loading-spinner-color' /> : 'Sign Up'
            }
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          Already have an account?
          &nbsp;
          <Link to={PATHS.SIGNIN} className="text-teal-500 hover:underline hover:text-teal-600 font-medium dark:text-teal-400 dark:hover:text-teal-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
