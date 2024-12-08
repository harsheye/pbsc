const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
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

// Multer Configuration with dynamic destination
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const tempDir = path.join(__dirname, '../public/uploads/temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
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
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    image: String,
    linkedIn: String
});

// Event Schema
const eventSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    date: {
        type: String,
        required: true
    },
    time: String,
    venue: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['workshop', 'seminar', 'conference', 'other'],
        default: 'workshop'
    },
    isUpcoming: {
        type: Boolean,
        default: true
    },
    image: String,
    registrationLink: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Contact Schema
const contactSchema = new mongoose.Schema({
    uid: String,
    name: String,
    email: String,
    phone: String,
    subject: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Image Schema
const imageSchema = new mongoose.Schema({
    imageUrl: String,
    uploadDate: { 
        type: Date, 
        default: Date.now 
    },
    category: String
});

// Initialize Models
const Faculty = mongoose.model('Faculty', facultySchema);
const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
const Event = mongoose.model('Event', eventSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Image = mongoose.model('Image', imageSchema);

// ============= FACULTY ROUTES =============
// Create Faculty
app.post('/api/faculty', async (req, res) => {
    try {
        const faculty = new Faculty({
            id: `FM${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name: req.body.name,
            position: req.body.position,
            education: req.body.education,
            linkedIn: req.body.linkedIn,
            image: req.body.image // This will now be /uploads/leader/name-timestamp.ext
        });
        await faculty.save();
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Faculty
app.patch('/api/faculty/:id', async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }
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
app.patch('/api/team/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/team/${req.file.filename}`;
        }
        const member = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  
  // Update the team member creation route as well
  app.post('/api/team', async (req, res) => {
    try {
      console.log('Create team member request:', req.body);

      const teamMember = new TeamMember({
        id: `TM${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: req.body.name,
        position: req.body.position,
        education: req.body.education,
        year: req.body.year,
        course: req.body.course,
        linkedIn: req.body.linkedIn,
        image: req.body.image
      });

      await teamMember.save();
      res.json(teamMember);
    } catch (error) {
      console.error('Error creating team member:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Get All Team Members
app.get('/api/team', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ position: 1 });
    res.json(members);
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
        console.log('Received event data:', req.body);
        
        // Generate a unique event ID
        const eventId = `EV${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        const event = new Event({
            ...req.body,
            id: eventId,
            isUpcoming: new Date(req.body.date) > new Date()
        });

        await event.save();
        res.json({ success: true, event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
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

        const category = req.body.category || 'default';
        const name = req.body.name || 'unnamed';
        const extension = path.extname(req.file.originalname);
        let uploadPath;
        let dbPath; // Path to store in database

        // Clean the name (remove special characters and spaces)
        const cleanName = name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const timestamp = Date.now();
        const filename = `${cleanName}-${timestamp}${extension}`;

        // Determine paths based on category
        switch(category) {
            case 'leader':
                uploadPath = `/public/uploads/leader/${filename}`;
                dbPath = `/uploads/leader/${filename}`;
                break;
            case 'team':
                uploadPath = `/public/uploads/team/${filename}`;
                dbPath = `/uploads/team/${filename}`;
                break;
            case 'events':
                uploadPath = `/public/uploads/events/${filename}`;
                dbPath = `/uploads/events/${filename}`;
                break;
            default:
                uploadPath = `/public/uploads/default/${filename}`;
                dbPath = `/uploads/default/${filename}`;
        }

        // Create directories if they don't exist
        const fullPath = path.join(__dirname, '..', uploadPath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Move the file to the correct location
        fs.renameSync(req.file.path, fullPath);

        res.json({ 
            success: true, 
            imageUrl: dbPath, // Send the database path
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
  app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

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
