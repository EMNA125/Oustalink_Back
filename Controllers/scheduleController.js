const scheduleService = require('../Services/scheduleService');

const scheduleController = {
    async createSchedule(req, res) {
        try {
            const scheduleData = req.body;
            const schedule = await scheduleService.createSchedule(scheduleData);
            res.status(201).json(schedule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllSchedules(req, res) {
        try {
            const schedules = await scheduleService.getAllSchedules();
            res.json(schedules);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getScheduleById(req, res) {
        try {
            const schedule = await scheduleService.getScheduleById(req.params.id);
            res.json(schedule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateSchedule(req, res) {
        try {
            const scheduleData = req.body;
            const schedule = await scheduleService.updateSchedule(req.params.id, scheduleData);
            res.json(schedule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deleteSchedule(req, res) {
        try {
            const result = await scheduleService.deleteSchedule(req.params.id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = scheduleController;
