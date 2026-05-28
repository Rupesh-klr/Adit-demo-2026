import { useState } from 'react';
import { addCustomer } from '../services/customerService';
import encrypt from '../utils/encrypt';
import { Toast, Button, CustomEmailHandler, CustomPhoneInput, CustomNameHandler } from './index';

import { motion } from "framer-motion";

const initialState = {
  name: "",
  phone: "",
  email: "",
  isEmailValid: false,
  isPhoneValid: false,
  isNameValid: false,
};

export default function CustomerForm({ onCustomerAdded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  const [form, setForm] = useState(initialState);
  const handleNameUpdate = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      isNameValid: e.target.isValid
    }));
  };
  const validateAllFields = () => {
    const isNameValid = form.name.trim().length >= 2 && !/[0-9]/.test(form.name);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(form.email);
    
    const phoneNumber = form.phone || "";
    const isPhoneValid = phoneNumber.length >= 9 && phoneNumber.length <= 15;
    console.log({ isNameValid, isEmailValid, isPhoneValid });
    return {
      isValid: isNameValid && isEmailValid && isPhoneValid,
      details: { isNameValid, isEmailValid, isPhoneValid }
    };
  };
  const checkFormValidity = () => {
    return form.isNameValid && form.isPhoneValid && form.isEmailValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateAllFields();

    if (!validation.isValid) {
      setError('Please ensure all fields are correct.');
      
      setForm(prev => ({ 
        ...prev, 
        ...validation.details 
      }));
      Toast.error('Validation failed. Please check your entries.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const encrypted = encrypt(form);
      let res = await addCustomer(encrypted);
      if (res?.ok === false) {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to add customer');
        Toast.error(errorData.error || 'Failed to add customer');
      } else if (res?.id) {
        setForm(initialState);
        onCustomerAdded();
        Toast.success('Customer added successfully!');
      }
    } catch (err) {
      setError('Failed to add customer');
      Toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };
  const handlePhoneChange = (phoneData, obj) => {
    setForm((prev) => ({
      ...prev,
      phone: phoneData,
      isPhoneValid: obj.error.valid
    }));
  };
  const handleEmailStatus = (data) => {
    setForm((prev) => ({
      ...prev,
      email: data.email,
      isEmailValid: data.isValid
    }));
  };
  return (
  <form 
    className="flex flex-col gap-8 p-6 md:p-10 rounded-2xl shadow-xl w-full bg-white max-w-2xl mx-auto border border-gray-100 max-w-[600px]" 
    onSubmit={handleSubmit}
  >
    {/* Title Section with subtle bottom border */}
    <div className="text-center pb-4 border-b border-gray-50">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
        Add Customer
      </h2>
      <p className="text-gray-500 text-sm mt-1">Fill in the details to register a new client</p>
    </div>

    {/* Input Fields Container with high spacing (gap-8) */}
    <div className="flex flex-col gap-8  ">
      
      <div className="transition-all duration-300 hover:translate-x-1">
        <CustomNameHandler
          name="name"
          value={form.name}
          label="Employee Name"
          required={true}
          onChange={handleNameUpdate}
        />
      </div>

      <div className="transition-all duration-300 hover:translate-x-1">
        <CustomPhoneInput
          label="Customer Phone Number"
          value={form.phone}
          onChange={handlePhoneChange}
          selectedCountryCode="+91"
          placeholder="Enter mobile number"
          multiple={false}
        />
      </div>

      <div className="transition-all duration-300 hover:translate-x-1">
        <CustomEmailHandler
          label="Customer Email"
          required={true}
          onChange={handleEmailStatus}
        />
      </div>

    </div>

    {/* Action Section */}
    <div className="pt-2">
      <Button
        type="submit"
        title="Save Customer"
        color="success"
        icon="save"
        size="lg" 
        loading={loading}
        className="w-full py-4 shadow-lg shadow-green-200 rounded-xl"
      />
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm font-medium text-center mt-4 bg-red-50 p-2 rounded-lg border border-red-100"
        >
          {error}
        </motion.div>
      )}
    </div>
  </form>
);
}
