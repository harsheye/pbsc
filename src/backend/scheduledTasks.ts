import cron from 'node-cron';
import { Event } from './models/Event';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update all events where date has passed to set isUpcoming to false
    await Event.updateMany(
      {
        date: { $lt: today },
        isUpcoming: true
      },
      {
        $set: { isUpcoming: false }
      }
    );

    console.log('Successfully updated event statuses');
  } catch (error) {
    console.error('Error updating event statuses:', error);
  }
}); 