import React, { useState } from 'react';
import { z } from 'zod';
import './SignUp.css';

const signUpSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstname: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof SignUpFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = signUpSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof SignUpFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    // Success - clear form and show success message
    setSubmitted(true);
    console.log('Form submitted:', result.data);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({ firstname: '', email: '' });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Sign Up</h1>
        {submitted ? (
          <div className="success-message">
            <p>✓ Successfully signed up!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className={errors.firstname ? 'error' : ''}
              />
              {errors.firstname && (
                <span className="error-message">{errors.firstname}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
