// Data – Indian States and Cities
export const statesData = {
  'Maharashtra': {
    id: 'IN-MH',
    schemes: 52,
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Thane']
  },
  'Uttar Pradesh': {
    id: 'IN-UP',
    schemes: 68,
    cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Allahabad', 'Meerut', 'Gorakhpur', 'Noida']
  },
  'Rajasthan': {
    id: 'IN-RJ',
    schemes: 45,
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bharatpur']
  },
  'Karnataka': {
    id: 'IN-KA',
    schemes: 49,
    cities: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belgaum', 'Davangere']
  },
  'Tamil Nadu': {
    id: 'IN-TN',
    schemes: 56,
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli']
  },
  'Gujarat': {
    id: 'IN-GJ',
    schemes: 43,
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar']
  },
  'West Bengal': {
    id: 'IN-WB',
    schemes: 47,
    cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman']
  },
  'Madhya Pradesh': {
    id: 'IN-MP',
    schemes: 51,
    cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar']
  },
  'Bihar': {
    id: 'IN-BR',
    schemes: 38,
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga']
  },
  'Andhra Pradesh': {
    id: 'IN-AP',
    schemes: 44,
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Rajahmundry']
  },
  'Telangana': {
    id: 'IN-TG',
    schemes: 41,
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam']
  },
  'Kerala': {
    id: 'IN-KL',
    schemes: 39,
    cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur']
  },
  'Punjab': {
    id: 'IN-PB',
    schemes: 36,
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Chandigarh']
  },
  'Haryana': {
    id: 'IN-HR',
    schemes: 34,
    cities: ['Gurugram', 'Faridabad', 'Hisar', 'Rohtak', 'Ambala', 'Karnal']
  },
  'Odisha': {
    id: 'IN-OR',
    schemes: 37,
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri']
  },
  'Chhattisgarh': {
    id: 'IN-CT',
    schemes: 33,
    cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon']
  },
  'Jharkhand': {
    id: 'IN-JH',
    schemes: 30,
    cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh']
  },
  'Uttarakhand': {
    id: 'IN-UT',
    schemes: 28,
    cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Rishikesh', 'Haldwani']
  },
  'Himachal Pradesh': {
    id: 'IN-HP',
    schemes: 26,
    cities: ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu']
  },
  'Assam': {
    id: 'IN-AS',
    schemes: 31,
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia']
  },
  'Delhi': {
    id: 'IN-DL',
    schemes: 58,
    cities: ['New Delhi', 'Dwarka', 'Rohini', 'Shahdara', 'Janakpuri', 'Saket']
  },
  'Goa': {
    id: 'IN-GA',
    schemes: 22,
    cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda']
  },
};

export const getAllStates = () => Object.keys(statesData);
export const getCities = (state) => statesData[state]?.cities || [];
export const getSchemeCount = (state) => statesData[state]?.schemes || 0;
