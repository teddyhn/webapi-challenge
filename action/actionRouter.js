const express = require('express');

const Actions = require('../data/helpers/actionModel');
const Projects = require('../data/helpers/projectModel');

const router = express.Router();

router.post('/', [validateProjectId, validateAction], (req, res) => {
    Actions.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error adding new action" })
        });
});

router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action);
});

router.delete('/:id', validateActionId, (req, res) => {
    Actions.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "action successfully deleted" })
            } else res.status(404).json({ message: "action could not be found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error removing the action" })
        });
});

router.put('/:id', [ validateActionId, validateAction ], (req, res) => {
    Actions.update(req.params.id, req.body)
        .then(action => {
            if (action) {
                res.status(200).json({ message: "action successfully updated" })
            } else res.status(404).json({ message: "action could not be found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error updating the action" })
        });
});

// custom middleware

function validateProjectId(req, res, next) {
    Projects.get(req.body.project_id)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else res.status(400).json({ message: "invalid project id" })
        });
};

function validateActionId(req, res, next) {
    const { id } = req.params;
    Actions.get(id)
        .then(action => {
            if (action) {
                req.action = action;
                next();
            } else res.status(400).json({ message: "invalid action id" })
        });
};

function validateAction(req, res, next) {
    if (req.body && Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing action data" })
    } else if (!req.body.description || !req.body.notes) {
        res.status(400).json({ message: "missing required field(s)" })
    } else next();
};

module.exports = router;