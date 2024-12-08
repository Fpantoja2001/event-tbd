const express = require('express');
const Event = require('../model/eventModel.js'); // Import the Event model
const router = express.Router();

// Create a new event
router.post('/event/create', async (req, res) => {
    try {
        const {
            eventName,
            eventDate,
            eventTime,
            privacy,
            inviteOption,
            eventLimit,
            eventCategory,
            reservation,
            eventCreator,
            eventAddress,
            eventDescription,
            eventImage,
            eventIcon,
        } = req.body;

        const newEvent = await Event.create({
            eventName,
            eventDate,
            eventTime,
            privacy,
            inviteOption,
            eventLimit,
            eventCategory,
            reservation,
            eventCreator,
            eventAddress,
            eventDescription,
            eventImage,
            eventIcon,
        });

        res.status(201).json({ message: 'Event created successfully.', event: newEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all events
router.get('/event/getAll', async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an event by ID
router.get('/event/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an event by ID
router.put('/event/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const {
            eventName,
            eventDate,
            eventTime,
            privacy,
            inviteOption,
            eventLimit,
            eventCategory,
            reservation,
            eventCreator,
            eventAddress,
            eventDescription,
            eventImage,
            eventIcon,
        } = req.body;

        event.eventName = eventName || event.eventName;
        event.eventDate = eventDate || event.eventDate;
        event.eventTime = eventTime || event.eventTime;
        event.privacy = privacy || event.privacy;
        event.inviteOption = inviteOption !== undefined ? inviteOption : event.inviteOption;
        event.eventLimit = eventLimit || event.eventLimit;
        event.eventCategory = eventCategory || event.eventCategory;
        event.reservation = reservation !== undefined ? reservation : event.reservation;
        event.eventCreator = eventCreator || event.eventCreator;
        event.eventAddress = eventAddress || event.eventAddress;
        event.eventDescription = eventDescription || event.eventDescription;
        event.eventImage = eventImage || event.eventImage;
        event.eventIcon = eventIcon || event.eventIcon;

        await event.save();

        res.json({ message: 'Event updated successfully.', event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an event by ID
router.delete('/event/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.destroy();
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
