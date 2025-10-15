const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'First name can only contain letters and spaces',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  
  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Last name can only contain letters and spaces',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .max(100)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email cannot exceed 100 characters'
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters'
    }),
  
  role: Joi.string()
    .valid('user', 'agent')
    .default('user')
});

const userLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Property validation schemas
const propertySchema = Joi.object({
  propertyType: Joi.string()
    .valid('Apartment', 'Villa', 'Studio', 'Office', 'House')
    .required(),
  
  propertyKeyword: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Property keyword must be at least 3 characters long',
      'string.max': 'Property keyword cannot exceed 100 characters'
    }),
  
  propertyDesc: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Property description must be at least 10 characters long',
      'string.max': 'Property description cannot exceed 2000 characters'
    }),
  
  propertyPrice: Joi.number()
    .positive()
    .max(999999999)
    .required()
    .messages({
      'number.positive': 'Property price must be a positive number',
      'number.max': 'Property price cannot exceed 999,999,999'
    }),
  
  status: Joi.string()
    .valid('rent', 'sale')
    .required(),
  
  rentType: Joi.string()
    .valid('monthly', 'weekly', 'daily', 'yearly')
    .required(),
  
  bedrooms: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.min': 'Bedrooms must be at least 1',
      'number.max': 'Bedrooms cannot exceed 20'
    }),
  
  bathrooms: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.min': 'Bathrooms must be at least 1',
      'number.max': 'Bathrooms cannot exceed 20'
    }),
  
  size: Joi.number()
    .positive()
    .max(999999)
    .required()
    .messages({
      'number.positive': 'Size must be a positive number',
      'number.max': 'Size cannot exceed 999,999'
    }),
  
  yearBuilt: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      'number.min': 'Year built cannot be before 1800',
      'number.max': 'Year built cannot be in the future'
    }),
  
  address: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Address must be at least 5 characters long',
      'string.max': 'Address cannot exceed 200 characters'
    }),
  
  country: Joi.string()
    .min(2)
    .max(50)
    .required(),
  
  state: Joi.string()
    .min(2)
    .max(50)
    .required(),
  
  neighborhood: Joi.string()
    .min(2)
    .max(50)
    .required(),
  
  amenities: Joi.array()
    .items(Joi.string())
    .max(20)
    .optional(),
  
  furnished: Joi.boolean().optional(),
  garages: Joi.boolean().optional(),
  
  garageSize: Joi.number()
    .positive()
    .max(9999)
    .optional()
    .messages({
      'number.positive': 'Garage size must be a positive number',
      'number.max': 'Garage size cannot exceed 9,999'
    }),
  
  videoUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Please provide a valid video URL'
    })
});

// Review validation schemas
const reviewSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters and spaces',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  review: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Review must be at least 10 characters long',
      'string.max': 'Review cannot exceed 1000 characters'
    }),
  
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5'
    })
});

// Message validation schemas
const messageSchema = Joi.object({
  propertyId: Joi.string()
    .required()
    .messages({
      'any.required': 'Property ID is required'
    }),
  
  senderName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Sender name can only contain letters and spaces',
      'string.min': 'Sender name must be at least 2 characters long',
      'string.max': 'Sender name cannot exceed 50 characters'
    }),
  
  senderEmail: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  senderPhone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  subject: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Subject must be at least 5 characters long',
      'string.max': 'Subject cannot exceed 200 characters'
    }),
  
  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 1000 characters'
    })
});

// Contact form validation
const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters and spaces',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  subject: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Subject must be at least 5 characters long',
      'string.max': 'Subject cannot exceed 200 characters'
    }),
  
  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 1000 characters'
    })
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  propertySchema,
  reviewSchema,
  messageSchema,
  contactSchema
};
