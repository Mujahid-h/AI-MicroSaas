export const SAMPLE_LAB_TEXT = `CBC RESULTS - Patient: John D.
WBC: 11.2 K/uL (H) [Ref: 4.5-11.0]
RBC: 4.1 M/uL [Ref: 4.5-5.9]
Hemoglobin: 11.8 g/dL (L) [Ref: 13.5-17.5]
Hematocrit: 35.2% (L) [Ref: 41-53%]
Platelets: 425 K/uL (H) [Ref: 150-400]
Glucose: 126 mg/dL (H) [Ref: 70-100]
HbA1c: 6.4% [Ref: <5.7% Normal, 5.7-6.4% Prediabetes]
Creatinine: 1.3 mg/dL [Ref: 0.7-1.2]
eGFR: 58 mL/min [Ref: >60]
Total Cholesterol: 218 mg/dL (H) [Ref: <200]
LDL: 148 mg/dL (H) [Ref: <100]
HDL: 38 mg/dL (L) [Ref: >40]
Triglycerides: 195 mg/dL (H) [Ref: <150]
TSH: 2.4 mIU/L [Ref: 0.4-4.0]
Vitamin D: 18 ng/mL (L) [Ref: 30-100]`;

export const SAMPLE_LEASE_TEXT = `COMMERCIAL LEASE AGREEMENT
Property: 1420 Harbor Blvd, Suite 300
Lease Term: March 1, 2024 – February 28, 2027
Monthly Base Rent: $4,200
Annual Rent Increase: 8% per year (CPI + 3%)
Security Deposit: $12,600 (3 months)
Renewal Option: Tenant must notify landlord 180 days prior to expiration
Late Fee: 10% of monthly rent if paid after 3rd of month
CAM Charges: Estimated $680/mo, subject to annual reconciliation (uncapped)
Personal Guarantee: Tenant's principal personally guarantees all obligations
Assignment: Landlord consent required; $500 transfer fee + 50% of any profit
Exclusivity: None granted
Holdover: 200% of monthly rent
Early Termination: 6 months penalty + unamortized TI allowance ($45,000)
Insurance: $2M general liability, $500K property, business interruption
Subletting: Prohibited without written consent
Tenant Improvement Allowance: $45,000 (amortized over lease term)
Parking: 3 spaces included; additional at $150/month each
Operating Hours: Business park hours 7am-10pm; after-hours HVAC $85/hr`;

export const MOCK_LAB_HISTORY = [
  {
    id: "1",
    date: "Feb 12, 2025",
    label: "Annual CBC Panel",
    flags: 4,
    score: "Moderate concern",
  },
  {
    id: "2",
    date: "Aug 3, 2024",
    label: "Metabolic Panel",
    flags: 2,
    score: "Minor concern",
  },
  {
    id: "3",
    date: "Jan 15, 2024",
    label: "Lipid Panel",
    flags: 1,
    score: "Normal range",
  },
];

export const MOCK_LEASE_LIST = [
  {
    id: "1",
    address: "1420 Harbor Blvd, Suite 300",
    type: "Commercial Office",
    expiry: "Feb 28, 2027",
    risk: 78,
  },
  {
    id: "2",
    address: "890 Industrial Way, Unit 5",
    type: "Warehouse",
    expiry: "Dec 31, 2025",
    risk: 42,
  },
];
