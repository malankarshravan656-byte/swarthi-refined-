// Nearby government offices mock data
export const officesData = [
  { id: 1, name: 'Common Service Centre – Andheri', type: 'csc', city: 'Mumbai', state: 'Maharashtra', address: 'Shop 12, Andheri Market, Mumbai 400058', distance: 1.2, phone: '022-26781234', hours: '9AM–6PM', services: ['Aadhaar Update', 'PAN Card', 'Passport', 'Certificate'] },
  { id: 2, name: 'District Collectorate – Mumbai Suburban', type: 'district', city: 'Mumbai', state: 'Maharashtra', address: 'Bandra (East), Mumbai 400051', distance: 3.5, phone: '022-26559900', hours: '10AM–5PM', services: ['Income Certificate', 'Domicile', 'Land Records'] },
  { id: 3, name: 'Block Development Office – Kurla', type: 'block', city: 'Mumbai', state: 'Maharashtra', address: 'Kurla West, Mumbai 400070', distance: 4.8, phone: '022-26544321', hours: '10AM–4PM', services: ['NREGA', 'BPL Certificate', 'Ration Card'] },
  { id: 4, name: 'CSC Centre – Nagpur Central', type: 'csc', city: 'Nagpur', state: 'Maharashtra', address: 'Near GPO, Mahal, Nagpur 440002', distance: 0.9, phone: '0712-2561234', hours: '8AM–8PM', services: ['All E-Gov Services', 'Aadhaar', 'PAN'] },
  { id: 5, name: 'Gram Panchayat Office – Hingna', type: 'gram', city: 'Nagpur', state: 'Maharashtra', address: 'Hingna Village, Nagpur 441110', distance: 12.3, phone: '0712-2789900', hours: '10AM–4PM', services: ['Village Certificates', 'NREGA', 'PM Kisan'] },
  { id: 6, name: 'District Social Welfare Office', type: 'district', city: 'Pune', state: 'Maharashtra', address: 'Shivajinagar, Pune 411005', distance: 2.1, phone: '020-25519900', hours: '10AM–5PM', services: ['Scholarships', 'Disability Certificate', 'OBC/SC/ST'] },
  { id: 7, name: 'CSC Centre – Connaught Place', type: 'csc', city: 'Delhi', state: 'Delhi', address: 'Block M, Connaught Place, New Delhi 110001', distance: 1.8, phone: '011-23456789', hours: '9AM–7PM', services: ['Aadhaar', 'PAN', 'Passport', 'Insurance'] },
  { id: 8, name: 'District Collector Office – South Delhi', type: 'district', city: 'Delhi', state: 'Delhi', address: 'Pushpa Bhawan, Patparganj, Delhi 110092', distance: 5.2, phone: '011-22345678', hours: '9:30AM–5PM', services: ['Income Certificate', 'Domicile', 'Marriage Registration'] },
  { id: 9, name: 'Block Development Office – Dwarka', type: 'block', city: 'Delhi', state: 'Delhi', address: 'Sector 6, Dwarka, New Delhi 110075', distance: 7.4, phone: '011-28044321', hours: '10AM–4PM', services: ['NREGA', 'Ration Card', 'Old Age Pension'] },
  { id: 10, name: 'CSC Centre – Lucknow', type: 'csc', city: 'Lucknow', state: 'Uttar Pradesh', address: 'Hazratganj, Lucknow 226001', distance: 2.3, phone: '0522-2234567', hours: '8AM–6PM', services: ['All E-services', 'Aadhaar', 'Birth/Death'] },
  { id: 11, name: 'CSC – Jaipur Walled City', type: 'csc', city: 'Jaipur', state: 'Rajasthan', address: 'Tripolia Bazar, Jaipur 302002', distance: 1.5, phone: '0141-2312345', hours: '9AM–6PM', services: ['Aadhaar', 'PAN', 'PMAY', 'PMKVY'] },
  { id: 12, name: 'District Collectorate – Bengaluru Urban', type: 'district', city: 'Bengaluru', state: 'Karnataka', address: 'CA Site, Ulsoor, Bengaluru 560042', distance: 4.0, phone: '080-22340000', hours: '10AM–5PM', services: ['Revenue Certificates', 'Property Cards', 'Caste Certificate'] },
];

export const getOfficesByCity = (city) => {
  if (!city) return officesData;
  return officesData.filter(o => o.city === city);
};

export const getOfficesByState = (state) => {
  if (!state) return officesData;
  return officesData.filter(o => o.state === state);
};
