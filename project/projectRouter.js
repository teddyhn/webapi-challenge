const express = require('express');

const Projects = require('../data/helpers/projectModel');

const router = express.Router();

router.post('/', validateProject, (req, res) => {
    Projects.insert(req.body)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error adding new project" })
        });
});

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error retrieving projects" })
        });
});

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project);
});

router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.params.id)
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error retrieving project actions" })
        })
});

router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "project successfully deleted" })
            } else res.status(404).json({ message: "project could not be found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error removing the project" })
        });
});

router.put('/:id', [ validateProjectId, validateProject ], (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(200).json({ message: "project successfully updated" })
            } else res.status(404).json({ message: "project could not be found" })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "error updating the project" })
        });
});

// custom middleware

function validateProjectId(req, res, next) {
    const { id } = req.params;
    Projects.get(id)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else res.status(400).json({ message: "invalid project id" })
        });
};

function validateProject(req, res, next) {
    if (req.body && Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing project data" })
    } else if (!req.body.name || !req.body.description) {
        res.status(400).json({ message: "missing required field(s)" })
    } else next();
};

module.exports = router;