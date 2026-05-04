import type { ApplicationFormField } from '@/types/loanApplication'

export const mockApplicationFormFields: ApplicationFormField[] = [
  {
    id: 'group-general',
    label: 'General Information',
    type: 'Group',
    mandatory: false,
    children: [
      {
        id: 'customer-type',
        label: 'Customer Type',
        type: 'Dropdown',
        mandatory: true,
        subdata: [
          { label: 'Individual', value: 'individual' },
          { label: 'Business', value: 'business' },
          { label: 'Cooperative Member', value: 'cooperative_member' },
        ],
      },
      {
        id: 'finance-type',
        label: 'Type of Financing',
        type: 'Dropdown',
        mandatory: true,
        subdata: [
          { label: 'Input Finance', value: 'input_finance' },
          { label: 'Equipment Finance', value: 'equipment_finance' },
          { label: 'Working Capital', value: 'working_capital' },
          { label: 'Land Development', value: 'land_development' },
        ],
      },
      {
        id: 'loan-amount',
        label: 'Requested Loan Amount',
        type: 'Text Field Numeric',
        mandatory: true,
      },
      {
        id: 'loan-purpose',
        label: 'Purpose of Loan',
        type: 'Text Field',
        mandatory: true,
      },
    ],
  },
  {
    id: 'group-applicant',
    label: 'Applicant Details',
    type: 'Group',
    mandatory: false,
    children: [
      {
        id: 'full-name',
        label: 'Full Name',
        type: 'Text Field',
        mandatory: true,
      },
      {
        id: 'national-id',
        label: 'National ID Number',
        type: 'Text Field',
        mandatory: true,
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'Text Field',
        mandatory: true,
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'Text Field',
        mandatory: true,
      },
    ],
  },
  {
    id: 'group-address',
    label: 'Address Details',
    type: 'Group',
    mandatory: false,
    children: [
      {
        id: 'country',
        label: 'Country',
        type: 'Dropdown',
        mandatory: true,
        subdata: [
          { label: 'Indonesia', value: 'indonesia' },
          { label: 'Suriname', value: 'suriname' },
          { label: 'Netherlands', value: 'netherlands' },
        ],
      },
      {
        id: 'province',
        label: 'Province / State',
        type: 'Text Field',
        mandatory: true,
      },
      {
        id: 'city',
        label: 'City / Village',
        type: 'Text Field',
        mandatory: true,
      },
      {
        id: 'street',
        label: 'Street Address',
        type: 'Text Field',
        mandatory: false,
      },
    ],
  },
  {
    id: 'supporting-docs',
    label: 'Supporting Documents',
    type: 'Attach File',
    mandatory: false,
  },
]
