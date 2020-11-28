import fs from 'fs';

import express, {Request, Response} from 'express';

import app from '../app/app';
import {jsonStoreFileName} from '../app/constants';

import responses from './responses';

const router = express.Router();

router.post('/createform', async (req: Request, res: Response) => {
    if (req.body.type == 'form') {
        const createForm = responses.createForm(req.body.context.post.message);
        res.json(createForm);
    } else {
        const message = app.createTicketFromPost(req);
        res.json({});
    }
});

router.get('/manifest.json', (req: Request, res: Response) => {
    fs.readFile('manifest.json', (err, data) => {
        if (err) {
            throw err;
        }
        const manifest = JSON.parse(data.toString());
        res.json(manifest);
    });
});

router.get('/bindings', (req: Request, res: Response) => {
    fs.readFile('bindings.json', (err, data) => {
        if (err) {
            throw err;
        }
        const bindings = JSON.parse(data.toString());
        res.json(bindings);
    });
});

router.post('/install', (req: Request, res: Response) => {
    // Write json file store
    fs.writeFile(jsonStoreFileName, JSON.stringify(req.body.values), 'utf8', (err) => {
        if (err) {
            console.log(err);
            res.statusMessage = 'unable to write json storage file';
            res.status(400).end();
        } else {
            console.log(jsonStoreFileName, ' successfully written');
            res.sendStatus(200);
        }
    });
});

router.post('/oauth2/complete', (req: Request, res: Response) => {
    res.send('hello');
});

export default router;
