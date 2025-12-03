// Payroll Calculation Utilities

export const calculateSalary = (basicSalary, allowances = {}, deductions = {}) => {
  const {
    hra = 0,
    transport = 0,
    medical = 0,
    special = 0
  } = allowances

  const {
    pf = 0,
    esi = 0,
    tds = 0,
    professionalTax = 0,
    other = 0
  } = deductions

  const grossSalary = basicSalary + hra + transport + medical + special
  const totalDeductions = pf + esi + tds + professionalTax + other
  const netSalary = grossSalary - totalDeductions

  return {
    basicSalary,
    allowances: {
      hra,
      transport,
      medical,
      special,
      total: hra + transport + medical + special
    },
    grossSalary,
    deductions: {
      pf,
      esi,
      tds,
      professionalTax,
      other,
      total: totalDeductions
    },
    netSalary
  }
}

export const calculatePF = (basicSalary, pfRate = 12) => {
  // PF is calculated on basic salary (max limit ₹15,000)
  const pfBase = Math.min(basicSalary, 15000)
  return {
    employee: (pfBase * pfRate) / 100,
    employer: (pfBase * pfRate) / 100,
    total: (pfBase * pfRate * 2) / 100
  }
}

export const calculateESI = (grossSalary, esiRate = 0.75) => {
  // ESI applicable if gross salary <= ₹21,000
  if (grossSalary > 21000) {
    return { employee: 0, employer: 0, total: 0 }
  }
  return {
    employee: (grossSalary * esiRate) / 100,
    employer: (grossSalary * 1.75) / 100, // Employer contributes 1.75%
    total: (grossSalary * 2.5) / 100
  }
}

export const calculateTDS = (annualIncome, deductions = 0) => {
  const taxableIncome = Math.max(0, annualIncome - deductions - 50000) // Standard deduction
  
  let tax = 0
  if (taxableIncome <= 250000) {
    tax = 0
  } else if (taxableIncome <= 500000) {
    tax = (taxableIncome - 250000) * 0.05
  } else if (taxableIncome <= 1000000) {
    tax = 12500 + (taxableIncome - 500000) * 0.20
  } else {
    tax = 112500 + (taxableIncome - 1000000) * 0.30
  }

  return {
    annualIncome,
    deductions,
    taxableIncome,
    tax,
    monthlyTax: tax / 12
  }
}

export const generatePayslip = (employee, salaryDetails, month, year) => {
  return {
    employeeId: employee.id,
    employeeName: employee.name,
    designation: employee.designation,
    department: employee.department,
    month,
    year,
    ...salaryDetails,
    generatedDate: new Date().toISOString()
  }
}

export const calculateLeaveBalance = (totalLeaves, leavesTaken) => {
  return {
    total: totalLeaves,
    taken: leavesTaken,
    balance: totalLeaves - leavesTaken
  }
}

