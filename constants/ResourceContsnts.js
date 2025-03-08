export const MOCK_DATA = {
  guides: [
    {
      id: "1",
      name: "Earthquake Safety Guide",
      type: "safety",
      description: "Essential steps to take during an earthquake",
      content:
        "1. Drop to the ground\n2. Take cover under sturdy furniture\n3. Hold on until shaking stops\n4. Stay away from windows\n5. Be prepared for aftershocks",
      tags: ["earthquake", "safety", "emergency"],
      priority: "high",
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      name: "First Aid Basics",
      type: "first_aid",
      description: "Basic first aid procedures everyone should know",
      content:
        "Important first aid steps:\n1. Check the scene for safety\n2. Call for emergency help\n3. Care for the person\n4. Monitor vital signs\n5. Document what happened",
      tags: ["medical", "emergency", "first-aid"],
      priority: "medium",
      lastUpdated: "2024-01-10",
    },
    // Add more guides...
  ],
  contacts: [
    {
      id: "1",
      name: "Emergency Medical Services",
      emergency_level: "high",
      contact: {
        phone: "911",
        email: "ems@emergency.com",
        alternate_phone: "555-0111",
      },
      description: "24/7 Emergency Medical Services",
      available_hours: "24/7",
      response_time: "5-10 minutes",
    },
    // Add more contacts...
  ],
  facilities: [
    {
      id: "1",
      name: "Central Hospital",
      type: "hospital",
      availability_status: "open",
      location: {
        address: {
          formatted_address: "123 Medical Center Dr, City, State",
          coordinates: {
            lat: 40.7128,
            lng: -74.006,
          },
        },
      },
      capacity: "500 beds",
      current_occupancy: "65%",
      operating_hours: {
        Monday: { open: "00:00", close: "23:59", is24Hours: true },
        Tuesday: { open: "00:00", close: "23:59", is24Hours: true },
        // Add more days...
      },
      emergency_unit: true,
      specialties: ["Trauma", "Cardiac", "Pediatric"],
      contact: {
        phone: "555-0123",
        emergency: "555-0124",
      },
    },
    // Add more facilities...
  ],
};

export const FACILITY_TYPES = [
  { id: 'facility_all', value: 'all', label: 'All Facilities', icon: 'view-grid' },
  { id: 'facility_hospital', value: 'hospital', label: 'Hospitals', icon: 'hospital-building' },
  { id: 'facility_shelter', value: 'shelter', label: 'Shelters', icon: 'home-outline' },
  { id: 'facility_fire', value: 'fire_station', label: 'Fire Stations', icon: 'fire-truck' },
  { id: 'facility_police', value: 'police', label: 'Police Stations', icon: 'police-badge' },
];

export const STATUS_TYPES = [
  { id: 'status_all', value: 'all', label: 'All Statuses', color: '#757575' },
  { id: 'status_open', value: 'open', label: 'Open', color: '#4CAF50' },
  { id: 'status_limited', value: 'limited', label: 'Limited', color: '#FFC107' },
  { id: 'status_closed', value: 'closed', label: 'Closed', color: '#F44336' },
];

export const GUIDE_CATEGORIES = [
  { id: 'guide_all', value: 'all', label: 'All Guides', icon: 'book-open-variant' },
  { id: 'guide_safety', value: 'safety', label: 'Safety', icon: 'shield-check' },
  { id: 'guide_first_aid', value: 'first_aid', label: 'First Aid', icon: 'medical-bag' },
  { id: 'guide_evacuation', value: 'evacuation', label: 'Evacuation', icon: 'run' },
  { id: 'guide_preparation', value: 'preparation', label: 'Preparation', icon: 'calendar-check' },
];
