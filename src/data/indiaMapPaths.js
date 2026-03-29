// Accurate India state SVG paths – viewBox "0 0 800 900"
// Simplified but geographically recognizable shapes for all major states

export const INDIA_STATES = [
  {
    name: "Jammu & Kashmir",
    d: "M220,20 L310,18 L340,40 L330,70 L290,95 L260,100 L230,80 L210,55 Z",
    label: [275, 58],
    capital: "Srinagar",
  },
  {
    name: "Ladakh",
    d: "M310,18 L420,15 L430,50 L400,80 L340,70 L330,40 Z",
    label: [370, 45],
    capital: "Leh",
  },
  {
    name: "Himachal Pradesh",
    d: "M260,100 L290,95 L330,70 L340,110 L310,140 L270,135 Z",
    label: [300, 115],
    capital: "Shimla",
  },
  {
    name: "Punjab",
    d: "M200,105 L260,100 L270,135 L250,160 L210,155 L195,130 Z",
    label: [228, 130],
    capital: "Chandigarh",
  },
  {
    name: "Haryana",
    d: "M250,160 L310,155 L320,195 L280,205 L245,190 Z",
    label: [283, 180],
    capital: "Chandigarh",
  },
  {
    name: "Delhi",
    d: "M290,185 L305,182 L308,200 L292,203 Z",
    label: [299, 193],
    capital: "New Delhi",
    isUT: true,
  },
  {
    name: "Uttarakhand",
    d: "M310,140 L380,130 L395,160 L370,180 L320,175 L310,155 Z",
    label: [350, 157],
    capital: "Dehradun",
  },
  {
    name: "Uttar Pradesh",
    d: "M280,205 L320,195 L370,180 L430,175 L470,195 L480,240 L450,270 L380,280 L300,265 L270,240 Z",
    label: [375, 228],
    capital: "Lucknow",
  },
  {
    name: "Rajasthan",
    d: "M110,145 L200,140 L245,190 L280,205 L270,240 L260,290 L210,310 L130,290 L95,250 L90,195 Z",
    label: [185, 235],
    capital: "Jaipur",
  },
  {
    name: "Bihar",
    d: "M470,195 L540,185 L565,210 L555,250 L510,265 L480,255 L480,240 Z",
    label: [517, 223],
    capital: "Patna",
  },
  {
    name: "Sikkim",
    d: "M545,175 L560,172 L562,188 L546,190 Z",
    label: [554, 181],
    capital: "Gangtok",
    isUT: false,
    small: true,
  },
  {
    name: "Arunachal Pradesh",
    d: "M580,130 L700,125 L710,165 L665,175 L600,170 L570,155 Z",
    label: [640, 150],
    capital: "Itanagar",
  },
  {
    name: "Assam",
    d: "M565,175 L625,165 L650,180 L640,210 L590,218 L560,205 Z",
    label: [605, 193],
    capital: "Dispur",
  },
  {
    name: "Nagaland",
    d: "M650,180 L685,178 L690,205 L660,210 L640,205 Z",
    label: [665, 193],
    capital: "Kohima",
    small: true,
  },
  {
    name: "Manipur",
    d: "M660,210 L690,207 L695,240 L665,245 L645,230 Z",
    label: [670, 226],
    capital: "Imphal",
    small: true,
  },
  {
    name: "Mizoram",
    d: "M645,245 L670,243 L672,268 L648,272 Z",
    label: [659, 258],
    capital: "Aizawl",
    small: true,
  },
  {
    name: "Meghalaya",
    d: "M563,210 L605,208 L610,230 L565,232 Z",
    label: [587, 220],
    capital: "Shillong",
    small: true,
  },
  {
    name: "Tripura",
    d: "M615,230 L638,226 L640,250 L617,252 Z",
    label: [629, 240],
    capital: "Agartala",
    small: true,
  },
  {
    name: "West Bengal",
    d: "M555,220 L560,205 L590,218 L595,250 L575,310 L555,340 L535,300 L540,255 Z",
    label: [566, 268],
    capital: "Kolkata",
  },
  {
    name: "Jharkhand",
    d: "M480,255 L510,265 L555,250 L540,285 L510,310 L475,300 L460,275 Z",
    label: [507, 283],
    capital: "Ranchi",
  },
  {
    name: "Odisha",
    d: "M475,300 L510,310 L540,285 L555,340 L540,390 L510,400 L470,385 L455,350 L460,310 Z",
    label: [503, 348],
    capital: "Bhubaneswar",
  },
  {
    name: "Chhattisgarh",
    d: "M380,280 L450,270 L475,300 L460,310 L455,350 L430,375 L395,370 L370,340 L355,300 Z",
    label: [413, 322],
    capital: "Raipur",
  },
  {
    name: "Madhya Pradesh",
    d: "M210,265 L300,265 L380,280 L355,300 L345,340 L310,360 L260,355 L210,330 L185,295 Z",
    label: [280, 312],
    capital: "Bhopal",
  },
  {
    name: "Gujarat",
    d: "M90,250 L130,245 L185,265 L185,295 L175,340 L150,370 L110,380 L75,350 L60,305 L70,270 Z",
    label: [125, 312],
    capital: "Gandhinagar",
  },
  {
    name: "Maharashtra",
    d: "M175,340 L185,295 L210,330 L260,355 L310,360 L345,340 L370,370 L395,370 L410,400 L390,430 L350,445 L290,450 L230,440 L185,410 L165,375 Z",
    label: [288, 400],
    capital: "Mumbai",
  },
  {
    name: "Andhra Pradesh",
    d: "M355,450 L410,440 L455,445 L470,475 L465,520 L440,545 L400,555 L360,540 L335,510 L330,475 Z",
    label: [400, 497],
    capital: "Amaravati",
  },
  {
    name: "Telangana",
    d: "M355,430 L395,430 L430,435 L455,445 L440,475 L410,480 L370,470 L345,450 Z",
    label: [397, 455],
    capital: "Hyderabad",
  },
  {
    name: "Karnataka",
    d: "M210,440 L230,440 L290,450 L350,445 L355,450 L345,450 L370,470 L355,510 L335,540 L300,550 L255,540 L215,505 L200,470 Z",
    label: [278, 492],
    capital: "Bengaluru",
  },
  {
    name: "Goa",
    d: "M195,455 L215,450 L218,475 L195,478 Z",
    label: [207, 465],
    capital: "Panaji",
    small: true,
  },
  {
    name: "Kerala",
    d: "M215,505 L255,540 L245,580 L220,620 L195,615 L188,575 L195,535 Z",
    label: [220, 562],
    capital: "Trivandrum",
  },
  {
    name: "Tamil Nadu",
    d: "M300,550 L335,540 L360,540 L400,555 L405,600 L380,650 L340,670 L300,650 L270,610 L255,570 L255,540 L300,550 Z",
    label: [330, 600],
    capital: "Chennai",
  },
];

export function getStateByName(name) {
  return INDIA_STATES.find(s => s.name === name);
}
