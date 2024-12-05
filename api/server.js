const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const DEFAULT_PROFILE_IMAGE = '/public/images/defaul.png'; // Adjust the path as needed
// CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:5000',
        'http://localhost:5001'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:44275/pbsc', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Multer Configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'D:/Github Stuffs/ieee/pbsc/public/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ============= MODELS =============


// Faculty Schema
const facultySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    position: String,
    education: String,
    year: String,
    course: String,
    image: {
        type: String,
        default: DEFAULT_PROFILE_IMAGE
    },
    linkedIn: String
});

// Team Member Schema
const teamMemberSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    position: String,
    education: String,
    year: Number,
    course: String,
    image: {
        type: String,
        default: DEFAULT_PROFILE_IMAGE
    },
    linkedIn: String
});

// Event Schema
const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    venue: String,
    timing: String,
    category: {
        type: String,
        enum: ['workshop', 'seminar', 'conference', 'other'],
        default: 'workshop'
    },
    isUpcoming: {
        type: Boolean,
        default: true
    },
    mainImage: String,
    imageStack: [String]
});

// Contact Schema
const contactSchema = new mongoose.Schema({
    uid: String,
    name: String,
    email: String,
    phone: String,
    subject: String,
    description: String
});

// Image Schema
const imageSchema = new mongoose.Schema({
    imageUrl: String,
    uploadDate: { 
        type: Date, 
        default: Date.now 
    }
});

// Initialize Models
const Faculty = mongoose.model('Faculty', facultySchema);
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
const Event = mongoose.model('Event', eventSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Image = mongoose.model('Image', imageSchema);

// ============= FACULTY ROUTES =============
// Create Faculty
app.post('/api/faculty', upload.single('image'), async (req, res) => {
    try {
        const imageUrl = `/public/${req.file.filename}`;
        const faculty = new Faculty({
            ...req.body,
            image: imageUrl
        });
        await faculty.save();
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Faculty
app.get('/api/faculty', async (req, res) => {
    try {
        const facultyMembers = await Faculty.find().sort({ id: 1 });
        res.json(facultyMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= TEAM MEMBER ROUTES =============
// Create Team Member
// In your server code (index.js)
app.patch('/api/team/:id', async (req, res) => {
  try {
    console.log('Update team member request:', req.body);

    // Validate that we have an image URL
    if (!req.body.image) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image URL is required' 
      });
    }

    const updateData = {
      name: req.body.name,
      position: req.body.position,
      education: req.body.education,
      year: req.body.year,
      course: req.body.course,
      linkedIn: req.body.linkedIn,
      image: req.body.image // Make sure this is the full URL from the upload
    };

    // Use findOneAndUpdate to ensure we get the updated document
    const teamMember = await TeamMember.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!teamMember) {
      return res.status(404).json({ 
        success: false, 
        message: 'Team member not found' 
      });
    }

    console.log('Updated team member:', teamMember);
    res.json({ 
      success: true, 
      data: teamMember 
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
  
  // Update the team member creation route as well
  app.post('/api/team', async (req, res) => {
    try {
      console.log('Create team member request:', req.body); // Debug log
  
      const teamMember = new TeamMember({
        name: req.body.name,
        position: req.body.position,
        education: req.body.education,
        year: req.body.year,
        course: req.body.course,
        linkedIn: req.body.linkedIn,
        image: req.body.image // Store the image URL
      });
  
      await teamMember.save();
      console.log('Created team member:', teamMember); // Debug log
      res.json(teamMember);
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Get All Team Members
app.get('/api/team', async (req, res) => {
    try {
        const teamMembers = await TeamMember.find().sort({ id: 1 });
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Team Member by Exact Position
app.get('/api/team/:position', async (req, res) => {
    try {
        const teamMember = await TeamMember.findOne({ position: req.params.position });
        if (!teamMember) {
            return res.status(404).json({ message: 'No team member found for this position' });
        }
        res.json(teamMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// ============= EVENT ROUTES =============
// Create Event
// In your server code (index.js)
// In your server code (index.js)
app.post('/api/events', async (req, res) => {
    try {
      console.log('Received event data:', req.body); // Debug log
  
      const event = new Event({
        title: req.body.title,
        description: req.body.description,
        date: new Date(req.body.date),
        time: req.body.time,
        venue: req.body.venue,
        category: req.body.category,
        isUpcoming: req.body.isUpcoming === 'true',
        mainImage: req.body.mainImage, // Store the image URL directly
        registrationLink: req.body.registrationLink
      });
  
      const savedEvent = await event.save();
      console.log('Saved event:', savedEvent); // Debug log
      res.json(savedEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Get All Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Event
app.patch('/api/events/:id', upload.array('images', 6), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files?.length > 0) {
            const imageUrls = req.files.map(file => `/public/${file.filename}`);
            updateData.mainImage = imageUrls[0];
            updateData.imageStack = imageUrls.slice(1);
        }
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= CONTACT ROUTES =============
// Create Contact
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ _id: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= IMAGE ROUTES =============
// Upload Single Image
// In your server code (index.js)
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          error: 'No image file provided' 
        });
      }
  
      // Change the URL format to match your public directory
      const imageUrl = `/public/${req.file.filename}`;
      const newImage = new Image({ imageUrl });
      await newImage.save();
  
      console.log('Image saved:', imageUrl);
      res.json({ 
        success: true, 
        imageUrl: `http://localhost:5000${imageUrl}`, // Add the full URL
        message: 'Image uploaded successfully' 
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
  // Also serve static files
  app.use('/public', express.static(path.join(__dirname, '../public')));

// Get All Images
app.get('/api/images', async (req, res) => {
    try {
        const images = await Image.find().sort({ uploadDate: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
